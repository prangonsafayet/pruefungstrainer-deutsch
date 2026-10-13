# C4 dynamic views

Five flows, step by step. Participant names are the real functions and files.

- [1. Sitting a full DTZ exam](#1-sitting-a-full-dtz-exam)
- [2. A local change reaches the cloud](#2-a-local-change-reaches-the-cloud)
- [3. Google sign-in through a PKCE redirect](#3-google-sign-in-through-a-pkce-redirect)
- [4. Boot with a corrupt stored document](#4-boot-with-a-corrupt-stored-document)
- [5. A deploy, a stale chunk, one reload](#5-a-deploy-a-stale-chunk-one-reload)

## 1. Sitting a full DTZ exam

A full DTZ sitting runs four modules: `hoeren`, `lesen`, `schreiben` and `sprechen`
(`DTZ_MODULES`). Hören and Lesen are marked against the key, one point per item. The
learner rates Schreiben and Sprechen on the paper's criteria. The certificate comes from
three Teilergebnisse, not from a total.

```mermaid
sequenceDiagram
  autonumber
  actor L as Learner
  participant D as DashboardPage<br/>useStartAttempt
  participant RS as runStore<br/>telcTrainerDtzRunV1
  participant R as MockExamRunnerPage<br/>useExamBinding
  participant U as useExamRun<br/>ExamRunnerView
  participant F as DTZ_FORMAT<br/>dtz-paper/*
  participant S as useTrainerSlice<br/>ProgressProvider
  participant LS as localStorage<br/>telcTrainerV1

  L->>D: Start Modelltest 3, full
  D->>RS: load("dtz")
  alt another run in progress
    D->>L: confirm "discard it?"
  end
  D->>RS: save(createRun({queue: DTZ_MODULES, phase: brief}))
  D->>R: navigate /dtz/exam/3/full
  R->>S: slice.format is dtz-paper
  R->>U: format DTZ_FORMAT, exam, settings
  U->>RS: load("dtz") and resume it
  loop each module in queue
    U->>L: ModuleBriefingCard (F.briefing)
    L->>U: Begin
    U->>RS: save(phase module, deadline = now + minutes)
    U->>L: F.moduleComponents[module]
    L->>U: answers h1.0, h3m.2, l2.4 = -1 for X, ...
    U->>RS: save(answers) on every change
    L->>U: Submit, or the deadline passes
    alt schreiben or sprechen
      U->>L: SelfRatingCard (F.rating)
      L->>U: criteria scores
      U->>RS: save(ratings, next index, phase brief)
    else hoeren or lesen
      U->>RS: save(times, next index, phase brief)
    end
  end
  U->>F: scoring.buildAttempt(finished run)
  F->>F: scoreModule hoeren, lesen (one point per item)
  F->>F: gradeFullExam: dtzLevel per Teilergebnis
  F->>F: dtzCertificate(levels)
  F-->>U: DtzAttempt { scores, ratings, result }
  U->>S: saveAttempt(attempt)
  S->>LS: normalize, stamp _updatedAt, write
  U->>RS: clear("dtz")
  U->>L: toast with completionToast
  U->>R: navigate /dtz/results/{attempt.id}
  R->>F: scoring.summarize(attempt)
  F-->>L: AttemptResults: bars, part levels, certificate
```

**The thresholds.** They are in `DTZ_PART_LINES` (`shared/config/dtzExam.ts`) and follow
the g.a.s.t. _Übungssatz 1_ marking:

| Teilergebnis  | B1 from | A2 from | Max |
| ------------- | ------- | ------- | --- |
| Hören + Lesen | 33      | 20      | 45  |
| Schreiben     | 15      | 7       | 20  |
| Sprechen      | 75      | 35      | 100 |

**The certificate rule (`dtzCertificate`).**

1. Sprechen below A2 rules out any certificate.
2. Zertifikat B1 needs Sprechen at B1 and either Hören + Lesen or Schreiben at B1.
3. Otherwise, Zertifikat A2 needs Sprechen at A2 or above and either written result at A2 or
   above.
4. Otherwise, the result is "unter A2".

**What is stored.** The attempt stores only the scores and `result`. The part levels are
derived from `scores` each time they are shown. The source does not state how many times a
Hören text is played, so the play count is an app setting (`playsAllowed`). It is never
presented as official.

**The clock.** It is an absolute `deadline`, so a reload in the middle of a module resumes
with the right time left. A run naming a module that the paper lacks sends the learner home.

## 2. A local change reaches the cloud

Every write goes to `localStorage` first. Sync runs only when a user is signed in.

```mermaid
sequenceDiagram
  autonumber
  actor L as Learner
  participant H as useLearnPlan<br/>(any slice.update)
  participant P as ProgressProvider
  participant LS as localStorage
  participant C as useCloudSync
  participant M as mergeProgress
  participant SB as Supabase<br/>public.progress

  Note over C,SB: Once per sign-in: fullSync
  C->>SB: select data where user_id = me
  SB-->>C: remote document or none
  C->>C: normalizeDatabase(remote)
  C->>M: mergeProgress(dbRef.current, remote)
  M-->>C: merged (union attempts, OR learnDone, max srs/activity, newer settings)
  C->>P: replaceLocal(merged) without restamping
  P->>LS: write telcTrainerV1
  C->>SB: upsert {user_id, data: merged}
  C->>C: pushedAt = merged._updatedAt

  L->>H: tick d4t2
  H->>P: update(recipe)
  P->>P: recipe, normalizeDatabase, stamp _updatedAt
  P->>LS: persistDatabase
  P-->>C: new db._updatedAt
  C->>C: clear timer, start 1500 ms timer
  L->>H: tick d4t3 within 1500 ms
  H->>P: update(recipe)
  P-->>C: newer _updatedAt
  C->>C: restart 1500 ms timer
  Note over C: timer fires
  alt first pull never succeeded (pushedAt is null)
    C->>C: fullSync() instead of a push
  else
    C->>SB: upsert {user_id, data: dbRef.current}
    alt success
      C->>C: chip "synced HH:MM"
    else failure
      C->>C: classifySyncError, logger.warn, chip offline
    end
  end
```

- **No overwrite before a merge.** The push is gated on a completed pull, so a device never
  writes over a remote document it has not merged. The `online` event retries a failed sync.
- **Offline is not an error.** An offline failure shows in the header badge and raises no
  toast. Other failures raise a toast with Retry.
- **Delete is not a merge.** The union-only merge cannot express a deletion. "Delete all
  progress" first calls `clearRemote(empty)`, which upserts a stamped empty document and reads
  the row back (RLS has no delete policy, so `.delete()` would silently remove nothing); the
  browser is emptied only after that succeeds.
  See the caveat in the [data model](data-model.md#merge-rules).

## 3. Google sign-in through a PKCE redirect

```mermaid
sequenceDiagram
  autonumber
  actor L as Learner
  participant UI as SyncSignInCard
  participant C as useCloudSync
  participant SJ as supabase-js<br/>supabaseClient.ts
  participant LS as localStorage
  participant SA as Supabase Auth
  participant G as Google

  L->>UI: Continue with Google
  UI->>C: signInWithProvider("google")
  C->>SJ: auth.signInWithOAuth({provider, redirectTo: origin + path, prompt: select_account})
  SJ->>LS: store PKCE code verifier (telcTrainerAuth storage)
  SJ->>SA: full-page redirect /authorize?code_challenge=...
  SA->>SA: check redirectTo against the allow-list
  SA->>G: redirect to consent
  L->>G: choose account, consent
  G->>SA: callback
  SA-->>L: redirect to app ?code=...
  Note over SJ: App boots again. detectSessionInUrl is on.
  SJ->>SA: exchange code + verifier for a session
  SA-->>SJ: session
  SJ->>LS: write telcTrainerAuth
  SJ-->>C: onAuthStateChange(session)
  C->>C: setUser, then fullSync (flow 2)
  alt callback carries error or error_description
    C->>L: toast "Sign-in was not completed", strip params
  else code present but no session after getSession
    C->>SA: exchangeCodeForSession(code) once more
    C->>C: strip ?code from the URL
    C->>L: toast the reason if it still fails
  end
```

**Why the flow is safe.**

- **No token in the URL.** PKCE keeps tokens out of the URL. The redirect carries a
  single-use code, and only the browser that holds the verifier can exchange it.
- **The redirect target cannot be redirected.** `redirectTo` is built from the page's own
  origin, and Supabase's redirect allow-list is the second gate.
- **No popup.** `Cross-Origin-Opener-Policy: same-origin` is safe because sign-in is a
  full-page redirect, never a popup.

## 4. Boot with a corrupt stored document

```mermaid
sequenceDiagram
  autonumber
  participant M as main.tsx
  participant P as ProgressProvider
  participant DB as progressDb.loadDatabase
  participant ST as storage.ts
  participant LS as localStorage
  participant LG as logger
  participant N as useProgressNotices
  actor L as Learner

  M->>P: render
  P->>DB: useState(loadDatabase)
  DB->>ST: readLocal("telcTrainerV1")
  ST->>LS: getItem
  LS-->>DB: text that is not a JSON object
  DB->>LG: error "Stored progress is not a document (N chars)"
  DB->>ST: writeLocal("telcTrainerRecoveryV1", raw)
  alt copy written (setAside)
    DB->>ST: persistDatabase(fresh document)
    DB-->>P: { db: fresh, damaged: raw, setAside: true }
    P->>N: loaded
    N->>L: warning toast "could not be read", action Download the damaged data
  else copy failed, storage full
    DB->>DB: holdingDamaged = true, every persist refused
    DB-->>P: { db: fresh, damaged: raw, setAside: false }
    P->>N: loaded
    N->>L: error toast, not dismissible: Download or Discard it and start fresh
    L->>N: either choice
    N->>DB: releaseDamaged(), then persistDatabase(dbRef.current)
  end
```

**The original is never overwritten silently.** An earlier build loaded a broken document
as an empty one. The next write then saved that empty document over the original. Now:

- the damaged bytes are copied aside before anything is written;
- if the copy cannot be made, the learner chooses what happens before any write.

**A full disk is handled the same way.** `writeLocal` returns `Result<void>` and tells its
failure listeners. The provider then toasts "Storage is full" with an "Export a backup"
action. Later reads see this tab's in-memory copy first.

## 5. A deploy, a stale chunk, one reload

```mermaid
sequenceDiagram
  autonumber
  participant N as Netlify
  participant T as Open tab<br/>(old build)
  participant SW as Service worker<br/>(v3.0.0)
  participant G as globalErrors.ts
  participant SC as staleChunk.ts
  participant SS as sessionStorage
  participant B as Route ErrorBoundary
  actor L as Learner

  N->>N: deploy new build (old hashed chunks gone)
  alt service worker controls the tab
    T->>SW: import() an old chunk
    SW-->>T: served from the old build's precache
    SW->>SW: finds the new sw.js (no-cache), installs, waits
    SW-->>T: onNeedRefresh, status update-waiting
    T->>L: toast "A new version is ready", Reload (never on the runner route)
    L->>T: Reload
    T->>SW: skip waiting, then reload into the new build
  else no worker, or the chunk is still missing
    T->>N: import() /assets/Old-hash.js
    N-->>T: 404
    T->>G: vite:preloadError
    G->>SC: reloadOnceForStaleChunk()
    SC->>SS: read telcTrainerChunkReloadAt
    alt exam route, offline, or reloaded within 5 min
      SC-->>G: false
      G-->>B: error propagates
      B->>L: ErrorFallback "needs a fresh copy", Reload button
    else claim the reload
      SC->>SS: write now
      SC->>T: location.reload()
      T->>N: GET / (no-cache)
      N-->>T: new index.html with the new hashes
    end
  end
```

- **The guard stores a timestamp in `sessionStorage`.** It survives the reload it caused,
  so a chunk that is still missing cannot cause a reload loop.
- **It never reloads during an exam sitting.** The run is saved, but a page that vanishes
  in the middle of a module is alarming. The learner chooses the moment with the fallback's
  Reload button.
- **It never reloads while offline.** A reload would land on the browser's offline page.
- **Dev builds use the boundary.** They fire no `vite:preloadError`, so the boundary's
  `reportRenderError` is the only path there.
