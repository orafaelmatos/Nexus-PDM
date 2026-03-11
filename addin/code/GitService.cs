using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;

namespace PDMAddin.Code
{
    public class GitService
    {
        public void InitializeRepository(string projectPath)
        {
            if (!Directory.Exists(Path.Combine(projectPath, ".git")))
            {
                RunGit(projectPath, "init");
                File.WriteAllText(Path.Combine(projectPath, ".gitignore"), "*.tmp\n*.bak\n~$*\n");
                CommitChanges(projectPath, "Initial commit");
            }
        }

        public List<string> GetModifiedFiles(string projectPath)
        {
            string output = RunGit(projectPath, "status --porcelain");
            return output.Split(new[] { '\n', '\r' }, StringSplitOptions.RemoveEmptyEntries)
                         .Select(line => line.Substring(3).Trim())
                         .ToList();
        }

        public void CommitChanges(string projectPath, string message)
        {
            RunGit(projectPath, "add .");
            RunGit(projectPath, $"commit -m \"{message.Replace("\"", "\\\"")}\"");
        }

        private string RunGit(string workingDir, string args)
        {
            var startInfo = new ProcessStartInfo
            {
                FileName = "git",
                Arguments = args,
                WorkingDirectory = workingDir,
                RedirectStandardOutput = true,
                RedirectStandardError = true,
                UseShellExecute = false,
                CreateNoWindow = true
            };

            using (var process = Process.Start(startInfo))
            {
                string output = process.StandardOutput.ReadToEnd();
                process.WaitForExit();
                return output;
            }
        }
    }
}
