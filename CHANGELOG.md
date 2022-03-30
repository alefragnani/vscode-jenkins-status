## [4.4.0] - 2022-03-30
### Added
* Support **Remote Development** (issue [#41](https://github.com/alefragnani/vscode-jenkins-status/issues/41))
* Support **Workspace Trust** (issue [#66](https://github.com/alefragnani/vscode-jenkins-status/issues/66))
* Support **Virtual Workspaces** (issue [#67](https://github.com/alefragnani/vscode-jenkins-status/issues/67))
* Support new Status Bar API (issue [#68](https://github.com/alefragnani/vscode-jenkins-status/issues/68))

## [4.3.0] - 2021-11-13
### Internal
- Add CONTRIBUTING documentation (issue [#71](https://github.com/alefragnani/vscode-jenkins-status/issues/71))
- Update dependencies (issue [#73](https://github.com/alefragnani/vscode-jenkins-status/issues/73))
- Security Alert: lodash (dependabot [PR #65](https://github.com/alefragnani/vscode-jenkins-status/pull/65))
- Security Alert: ssri (dependabot [PR #64](https://github.com/alefragnani/vscode-jenkins-status/pull/64))
- Security Alert: y18n (dependabot [PR #63](https://github.com/alefragnani/vscode-jenkins-status/pull/63))
- Security Alert: elliptic (dependabot [PR #62](https://github.com/alefragnani/vscode-jenkins-status/pull/62))

## [4.2.1] - 2020-09-05
### Fixed
- `Open in Jenkins (Console Output)` command with unnamed job (issue [#56](https://github.com/alefragnani/vscode-jenkins-status/issues/56))

## [4.2.0] - 2020-08-08
### Internal
- Use `vscode-ext-codicons` package (issue [#52](https://github.com/alefragnani/vscode-jenkins-status/issues/52))
- Shrink installation size/time (issue [#51](https://github.com/alefragnani/vscode-jenkins-status/issues/51))

### Fixed
- Security Alert: elliptic (dependabot [PR #54](https://github.com/alefragnani/vscode-jenkins-status/pull/54))
- Security Alert: lodash (dependabot [PR #53](https://github.com/alefragnani/vscode-jenkins-status/pull/53))

## [4.1.0] - 2020-06-14
## Added
- Localization support (issue [#30](https://github.com/alefragnani/vscode-jenkins-status/issues/30))

### Internal
- Support Extension View Context Menu (issue [#50](https://github.com/alefragnani/vscode-jenkins-status/issues/50))
- Migrate from TSLint to ESLint (issue [#47](https://github.com/alefragnani/vscode-jenkins-status/issues/47))

## [4.0.0] - 2020-02-22
### Added
- **Multiple Jobs** and **in-progress** status support (Thanks to @eramitmittal [PR #17](https://github.com/alefragnani/vscode-jenkins-status/pull/17))
- Auto-detect changes in `.jenkins` file

### Changed
- **Status Bar** tooltip

### Fixed
- Skip authentication when no `username` is provided (Thanks to @leeopop [PR #35](https://github.com/alefragnani/vscode-jenkins-status/pull/35))

## [3.1.2] - 2019-05-28
### Fixed
- Security Alert: tar

## [3.1.1] - 2019-03-14
### Fixed
- What's New page broken in VS Code 1.32 due to CSS API changes
- Updated `.jenkins` example in README (Thanks to @kimitaka [PR #31](https://github.com/alefragnani/vscode-jenkins-status/pull/31))

## [3.1.0] - 2019-01-18
### Added
- Status Bar improvements (Thanks to @LinuxSuRen [PR #29](https://github.com/alefragnani/vscode-jenkins-status/pull/29))

## [3.0.0] - 2018-12-02
### Added
- What's New

## [2.2.0] - 2018-04-16
### Added
- Patreon button

## [0.6.1 - 2.1.1] - 2018-04-13
### Fixed
- Incorrect value in `strictTls` sample

## [0.6.0 - 2.1.0] - 2018-04-13
### Added
- HTTPS Support using `NODE_TLS_REJECT_UNAUTHORIZED` environment variable (PR [#23](https://github.com/alefragnani/vscode-jenkins-status/pull/23) - kudos to @grzegorzjudas)

## [0.5.1 - 2.0.1] - 2017-11-13
### Fixed
- Error while opening single-root workspace with no active file

## [0.5.0 - 2.0.0] - 2017-10-28
### Added
- Multi-root support (issue [#18](https://github.com/alefragnani/vscode-jenkins-status/issues/18))

## [0.4.1 - 1.3.1] - 2017-10-27
### Fixed
- Fix tooltip for failed builds (PR [#15](https://github.com/alefragnani/vscode-jenkins-status/pull/15) - kudos to @pzelnip)

## [0.4.0 - 1.3.0] - 2017-06-10
### Added
- Support Authentication (PR [#10](https://github.com/alefragnani/vscode-jenkins-status/pull/10) - kudos to @mikepatrick and @umens)

## [0.3.0 - 1.2.0] - 2017-01-03
### Added
- New Command `Open in Jenkins` (Console Output)

## [0.2.0 - 1.1.0] - 2016-12-29
### Added
- Polling for automatic status update (issue [#1](https://github.com/alefragnani/vscode-jenkins-status/issues/1))

## [0.1.2 - 1.0.1] -2016-12-26 
### Fixed
- Support for larger JSON responses (PR [#7](https://github.com/alefragnani/vscode-jenkins-status/pull/7) - kudos to @vojtechhabarta)

## [0.1.1 - 1.0.0] - 2016-08-29

### Fixed
- No StatusBar added when some connection error occurs (issue [#5](https://github.com/alefragnani/vscode-jenkins-status/issues/5))
- Error running commands for non Jenkins project (issue [#6](https://github.com/alefragnani/vscode-jenkins-status/issues/6))

## [0.1.0 - 0.9.0] - 2016-08-28
- Initial release
