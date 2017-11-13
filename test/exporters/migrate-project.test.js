const fs = require('fs-extra')
const path = require('path')
const assert = require('assert')
const mockFs = require('mock-fs')

const migrateProject = require('../../src/js/exporters/migrate-project')

let fixturesPath = path.join(__dirname, '..', 'fixtures')

describe('migrate-project', () => {
  before(function () {
    // fake filesystem
    mockFs({
      [fixturesPath]: {
        'no-parent': {
          'no-parent.fountain': '',
          'storyboards': {
            'storyboarder.settings': '',
            'Scene-1-INT-HOME-DAY-1-162F0': {
              'Scene-1-INT-HOME-DAY-1-162F0.storyboarder': ''
            }
          }
        }
      }
    })
  })

  it('can migrate a project', async () => {
    // simulate the trash fn so we can use it with mockFs
    const trashFn = async filename => fs.removeSync(filename)

    await migrateProject(path.join(fixturesPath, 'no-parent', 'no-parent.fountain'), trashFn)

    // script file stays in place
    assert(fs.existsSync(path.join(fixturesPath, 'no-parent', 'no-parent.fountain')))
    assert(fs.existsSync(path.join(fixturesPath, 'no-parent', 'no-parent.storyboarderproject')))
    assert(fs.existsSync(path.join(fixturesPath, 'no-parent', 'no-parent.storyboarderproject', 'storyboards')))
    assert(fs.existsSync(path.join(fixturesPath, 'no-parent', 'no-parent.storyboarderproject', 'storyboards', 'storyboarder.settings')))

    // TODO
    assert(fs.existsSync(path.join(fixturesPath, 'no-parent', 'no-parent.storyboarderproject', 'storyboards', 'Scene-1-INT-HOME-DAY-1-162F0.storyboarderscene')))

    assert(!fs.existsSync(path.join(fixturesPath, 'no-parent', 'no-parent.storyboarder')))
    assert(!fs.existsSync(path.join(fixturesPath, 'no-parent', 'storyboards')))
    assert(!fs.existsSync(path.join(fixturesPath, 'no-parent', 'storyboards', 'storyboarder.settings')))
    assert(!fs.existsSync(path.join(fixturesPath, 'no-parent', 'no-parent.storyboarder', 'no-parent.fountain')))
  })

  after(function () {
    mockFs.restore()
  })
})
