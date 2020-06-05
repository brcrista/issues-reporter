# Summarize Issues

[![GitHub Actions build badge](https://github.com/actions/typescript-action/workflows/build-test/badge.svg)](https://github.com/brcrista/summarize-issues/actions?query=workflow%3Abuild-test)

GitHub Action that generates a Markdown summary of the issues in a repo.

See a full example at https://github.com/brcrista/summarize-issues-test.

## Example

```yml
name: Generate issues report

on:
  schedule:
    - cron: 0/50 * * * 1-5

env:
  OUTPUT_FILE_NAME: IssuesReport.md
  COMMITTER_EMAIL: actions@github.com
  COMMITTER_NAME: github-actions
  COMMITTER_USERNAME: github-actions

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v2

    - uses: brcrista/summarize-issues@v2
      with:
        title: 'My Issues Report'
        configPath: '.github/workflows/issues-report-config.json'
        outputPath: ${{ env.OUTPUT_FILE_NAME }}
        token: ${{ secrets.GITHUB_TOKEN }}

    - name: "Commit if any changes were made"
      run: |
        git remote add github "https://$COMMITTER_USERNAME:${{ secrets.GITHUB_TOKEN }}@github.com/$GITHUB_REPOSITORY.git"
        git pull github ${GITHUB_REF} --ff-only
        if [[ `git status --porcelain` ]]; then
          git add ${OUTPUT_FILE_NAME}
          git config --global user.email $COMMITTER_EMAIL
          git config --global user.name $COMMITTER_NAME
          git commit -m "Update $OUTPUT_FILE_NAME"
          git push github HEAD:${GITHUB_REF}
        fi
```

where `issues-report.json` looks like:

```json
[
  {
    "section": "Section with green status",
    "labels": ["incident-repair", "short-term"],
    "threshold": 10
  },
  {
    "section": "Section with yellow status",
    "labels": ["needs-triage"],
    "threshold": 2
  },
  {
    "section": "Section with red status",
    "labels": ["bug"],
    "threshold": 1
  }
]
```

This will commit a Markdown file named `IssuesReport.md` that looks like this:

```markdown
### My Issues Report
### Summary
| Section Title | Labels | Threshold | Count | Status |
| -- | -- | -- | -- | -- |
| [Section with green status](#-Section-with-green-status-query) | `incident-repair`, `short term` | 10 | 3 | 💚🥳 |
| [Section with yellow status](#-Section-with-yellow-status-query) | `needs-triage` | 3 | 3 | 💛😬 |
| [Section with red status](#%EF%B8%8F-Section-with-red-status-query) | `bug` | 1 | 3 | ❤️🥵 |
## Details
### 💚🥳 Section with green status [(query)](https://github.com/test/repo/issues?q=is%3Aissue+is%3Aopen+label%3Aincident-repair+label%3A%22short%20term%22)
Total: 3

Threshold: 10

Labels: `incident-repair`, `short term`

| Owner | Count |
| -- | -- |
| [**Unassigned**](https://github.com/test/repo/issues?q=is%3Aissue+is%3Aopen+label%3Aincident-repair+label%3A%22short%20term%22+no%3Aassignee) | 2 |
| [brcrista](https://github.com/test/repo/issues?q=is%3Aissue+is%3Aopen+label%3Aincident-repair+label%3A%22short%20term%22+assignee%3Abrcrista) | 1 |
### 💛😬 Section with yellow status [(query)](https://github.com/test/repo/issues?q=is%3Aissue+is%3Aopen+label%3Aneeds-triage)
Total: 3

Threshold: 3

Labels: `needs-triage`

| Owner | Count |
| -- | -- |
| [**Unassigned**](https://github.com/test/repo/issues?q=is%3Aissue+is%3Aopen+label%3Aneeds-triage+no%3Aassignee) | 2 |
| [brcrista](https://github.com/test/repo/issues?q=is%3Aissue+is%3Aopen+label%3Aneeds-triage+assignee%3Abrcrista) | 1 |
### ❤️🥵 Section with red status [(query)](https://github.com/test/repo/issues?q=is%3Aissue+is%3Aopen+label%3Abug)
Total: 3

Threshold: 1

Labels: `bug`

| Owner | Count |
| -- | -- |
| [**Unassigned**](https://github.com/test/repo/issues?q=is%3Aissue+is%3Aopen+label%3Abug+no%3Aassignee) | 2 |
| [brcrista](https://github.com/test/repo/issues?q=is%3Aissue+is%3Aopen+label%3Abug+assignee%3Abrcrista) | 1 |
```
