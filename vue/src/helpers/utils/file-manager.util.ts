import * as fs from 'fs'

type IUseFileManager = {
  readFile(srcPath: string): string | undefined
  writeFile(srcPath: string, payload: string): Promise<void>
  removeFile: (srcPath: string) => Promise<void>
}

function useFileManagerUtil(): IUseFileManager {
  function readFile(srcPath: string): string | undefined {
    if (fs.existsSync(srcPath)) return fs.readFileSync(srcPath, { encoding: 'utf8' })
    else return undefined
  }

  async function writeFile(srcPath: string, payload: string): Promise<void> {
    await new Promise<void>((resolve: (value: void | PromiseLike<void>) => void, reject: (reason?: any) => void) => {
      fs.writeFile(srcPath, payload, (err: NodeJS.ErrnoException | null) => {
        if (err) {
          reject(`Could not write to file ${srcPath}.`)
        } else resolve()
      })
    })
  }

  async function removeFile(srcPath: string): Promise<void> {
    await new Promise<void>((resolve: (value: void | PromiseLike<void>) => void, reject: (reason?: any) => void) => {
      fs.rm(srcPath, (err: NodeJS.ErrnoException | null) => {
        if (err) {
          reject(`Could not remove file ${srcPath}.`)
        } else resolve()
      })
    })
  }

  return { readFile, writeFile, removeFile }
}

export { useFileManagerUtil }
