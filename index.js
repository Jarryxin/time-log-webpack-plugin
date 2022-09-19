const chalk = require("chalk");
const slog = require("single-line-log");
const { version } = require("webpack");
const semver = require("semver");

class TimeLogWebpackPlugin {
  constructor(options) {
    this.options = options;
  }

  apply(compiler) {
    compiler.hooks.watchRun.tap("TimeLogPlugin", (watching) => {
      let changeFiles;
      if (semver.gte(version, "5.0.0")) {
        changeFiles = watching.modifiedFiles;
      } else {
        changeFiles = watching.watchFileSystem.watcher.mtimes;
      }
      if (changeFiles && changeFiles.size > 0) {
        for (let file of changeFiles) {
          console.log(chalk.green("当前改动文件：" + file));
        }
      }
    });

    compiler.hooks.compile.tap("TimeLogPlugin", () => {
      const lineSlog = slog.stdout;
      let text = "开始编译：";
      this.startTime = Date.now();

      this.timer = setInterval(() => {
        text += "█";
        lineSlog(chalk.green(text));
      }, 50);
    });

    compiler.hooks.done.tap("TimeLogPlugin", () => {
      this.timer && clearInterval(this.timer);
      let endTime = Date.now();
      console.log(
        chalk.yellow(
          " 编译完成，用时：" + (endTime - this.startTime) / 1000 + "s"
        )
      );
    });
  }
}

module.exports = TimeLogWebpackPlugin;
