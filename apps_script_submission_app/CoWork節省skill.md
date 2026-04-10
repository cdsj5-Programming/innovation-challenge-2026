---
name: resource-saver
description: Reduce unnecessary token, context, browser, tool, and loop usage in Claude Code / cowork workflows. Use this skill whenever the user wants to save resources, lower cost, reduce wasted Chrome/browser operations, avoid long logs or large outputs, optimize agent/tool usage, or asks whether a step is really necessary before doing it. Also use this skill whenever a task may involve repeated browser actions, long context history, large files, verbose logs, retries, scraping, or multi-step automation that could become expensive.
---

# Resource Saver

A skill for completing tasks with the minimum necessary resource usage.

Its purpose is to reduce:
- token waste
- context growth
- unnecessary browser usage
- oversized tool outputs
- repeated loops
- avoidable retries
- expensive multi-step execution

Use this skill before starting work when the task might become expensive.

## Core rule

Before doing heavy work, first determine whether the expensive step is actually necessary.

Do not default to:
- opening Chrome
- loading full pages
- reading full files
- dumping full logs
- retrying many times
- continuing long multi-step chains
- reusing a bloated session if a fresh one would be cheaper

## Primary objective

Complete the user's goal with the least total resource usage while preserving correctness.

Prioritize:
1. correctness
2. low resource usage
3. speed
4. completeness beyond what the user needs

If a cheaper path can achieve the same outcome, use the cheaper path.

## Initial resource triage

At the start of the task, identify likely cost drivers.

Check for:
- browser / Chrome automation
- long context history
- repeated subagent or tool calls
- large HTML or page content
- long logs
- large files or folders
- repeated retries
- recursive planning loops
- unnecessary code execution
- reading more content than needed

Then briefly decide:
- what is truly required
- what can be skipped
- what can be deferred unless needed
- what can be summarized instead of fully loaded

## Ask before expensive actions

If the task may require expensive steps, ask a short gating question before proceeding.

Use questions like:
- Do you actually need browser automation, or is an API / direct request enough?
- Do you need the full page, or only a few fields?
- Do you need the whole file, or just the relevant section?
- Do you want detailed logs, or only a short result summary?
- Is retrying important here, or should I fail fast?
- Do you need a full end-to-end run now, or just a low-cost first pass?
- Should I reuse the current session, or restart clean to avoid context bloat?

If the user has already implied the answer, do not ask again. Just follow the lower-cost path.

## Decision policy

### 1) Prefer direct data over browser automation
Use API, structured endpoint, local parsing, or direct file reading before browser automation.

Only use browser / Chrome when it is clearly necessary, such as:
- login-dependent UI-only workflows
- JS-rendered content with no usable API
- click-path validation
- visual confirmation the user specifically asked for

If browser use is required:
- minimize page loads
- avoid unnecessary screenshots
- avoid repeated reloads
- extract only target fields
- do not return full HTML unless explicitly needed

### 2) Prefer extraction over full content
Do not pass large raw content forward if a compact extraction is enough.

Examples:
- return `title, price, date` instead of whole HTML
- return key rows instead of full table dump
- return summary counts instead of full logs
- return matching snippets instead of full file

### 3) Control context growth
Treat context as a cost center.

Avoid:
- carrying long irrelevant history
- repeating the same instructions
- re-pasting large outputs into later steps
- chaining too many dependent steps in one thread

When appropriate:
- summarize previous results compactly
- reset approach mentally and continue from a concise state
- keep only the minimum state needed for the next step

### 4) Limit loops and retries
Do not keep looping unless there is evidence that another attempt is worth it.

Default behavior:
- keep retries low
- stop if repeated attempts show no new progress
- prefer one diagnostic retry over blind repetition

### 5) Keep outputs compact
Default to concise outputs unless the user asked for full detail.

Prefer:
- short summary
- exact answer
- selected evidence
- next-step options only when needed

Avoid verbose reasoning dumps.

### 6) Use progressive disclosure
Start cheap, then escalate only if needed.

Recommended escalation ladder:
1. clarify scope
2. inspect minimal data
3. extract only relevant fields
4. run one focused action
5. escalate to browser / multi-step / deeper analysis only if still necessary

## Workflow

### Step 1: Classify the task
Classify the task into one of these patterns:
- simple answer
- file lookup
- data extraction
- browser automation
- debugging
- repeated workflow
- code generation
- validation / verification

### Step 2: Identify highest-cost step
State internally:
- what is likely most expensive
- whether it is necessary
- whether there is a cheaper substitute

### Step 3: Gate the expensive path
If needed, ask one short question to confirm whether the expensive part is required.

Do not ask many questions. Ask only what changes cost materially.

### Step 4: Execute the cheapest valid path
Choose the lowest-cost path that still satisfies the task.

### Step 5: Escalate only on evidence
Escalate only if:
- the cheap path fails
- required data is unavailable
- the user explicitly wants the expensive path
- correctness would otherwise suffer

## Specific rules for common high-cost situations

## Browser / Chrome tasks
Before using browser automation, check:
- Is there an API?
- Is the information static in the HTML source?
- Can I use one targeted request instead?
- Does the user need interaction or only data?

If browser is unavoidable:
- open the minimum number of pages
- avoid page-wide extraction
- avoid repeated refresh
- capture only the needed elements
- summarize DOM findings instead of dumping them

## Logs
Never return full logs by default.

Return:
- error type
- 3 to 10 most relevant lines
- counts or pattern summary
- what changed between attempts

## Files
Do not read entire files unless necessary.

Prefer:
- locate relevant section
- search for keywords
- inspect only matching passages
- summarize before reading more

## Code / automation
Do not run heavy workflows immediately.

First determine:
- can static inspection answer this?
- can one small test answer this?
- is full execution required?

## Repeated workflows
If the task is repetitive, standardize and cache mentally:
- same input shape
- same decision rules
- same output format

Avoid recomputing the same judgment from scratch.

## User-facing behavior

When resource savings matter, communicate briefly and clearly.

Good examples:
- I can do this with browser automation, but a direct extraction path is cheaper. I'll use that first.
- This step will generate a lot of output. I'll only pull the fields that matter.
- The current thread is carrying too much context; I'll keep only the essential state.
- We probably don't need the full log. I'll inspect the error lines first.
- A full end-to-end run is possible, but a low-cost first pass should answer most of this.

Do not sound defensive. Sound efficient and deliberate.

## Output style

Default format:
- Decision
- Why this lower-cost path is sufficient
- Result
- Escalation trigger if needed

### Example
**Decision**
Use direct extraction instead of browser automation.

**Why**
The user only needs the price and date, so loading the full page and interacting with Chrome is unnecessary.

**Result**
Price: ...
Date: ...

**Escalation trigger**
Use browser only if the site blocks direct access or requires authenticated interaction.

## Hard stop rules

Stop and reconsider if:
- context is getting bloated
- outputs are mostly repetitive
- retries are not changing evidence
- browser actions are being used as a default instead of a necessity
- the workflow is collecting more data than the user asked for

In those cases, switch to a cheaper path or ask one focused gating question.

## Success criteria

This skill is successful when:
- the task is completed correctly
- fewer expensive actions are used
- unnecessary browser / tool / loop usage is avoided
- outputs are smaller and more useful
- the user gets the same result with lower cost