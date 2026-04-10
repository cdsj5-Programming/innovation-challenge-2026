# Local Service Config

Use these values as the default local integration targets for this workspace unless the user provides newer ones.

## Google workspace

- Google Drive folder URL: `https://drive.google.com/drive/folders/1arv_EIIfHfE2JXSFmdn-QyHxmOtSmrUX`
- Google Drive folder ID: `1arv_EIIfHfE2JXSFmdn-QyHxmOtSmrUX`
- Google Sheet URL: `https://docs.google.com/spreadsheets/d/1J4GKtAyeJct4GMfDZUQbwXournHjAlx7fq4l78rLhMY/edit?gid=0#gid=0`
- Google Sheet ID: `1J4GKtAyeJct4GMfDZUQbwXournHjAlx7fq4l78rLhMY`
- primary worksheet: `工作表1`
- student roster worksheet: `學生名單`
- Apps Script Web App URL: `https://script.google.com/macros/s/AKfycbzjQu0LWyLXZwvs9EXaeIU8CxB0x2G6RHVkqYFkib0Oe4A0_oxm5qgnODTVATg71QEN/exec`

## GitHub context

- owner: `cdsj5-Programming`
- repository: `innovation-challenge-2026`
- repo slug: `cdsj5-Programming/innovation-challenge-2026`

## Secret handling

- Never place personal access tokens inside `SKILL.md` or checked-in reference files.
- If GitHub auth is needed for local automation, read `GITHUB_TOKEN` from the workspace root `.env.local`.
- Expected local keys:
  - `GITHUB_OWNER`
  - `GITHUB_REPO`
  - `GITHUB_REPO_SLUG`
  - `GITHUB_TOKEN`
