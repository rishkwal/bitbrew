import chalk from 'chalk';
import ora, { Ora } from 'ora';

class CliLogger {
  private spinner: Ora | null = null;

  log(message: string): void {
    this.clearSpinner();
    console.log(chalk.white(message));
  }

  success(message: string): void {
    this.clearSpinner();
    console.log(chalk.green(`✔ ${message}`));
  }

  info(message: string): void {
    this.clearSpinner();
    console.log(chalk.blue(`ℹ ${message}`));
  }

  warn(message: string): void {
    this.clearSpinner();
    console.log(chalk.yellow(`⚠ ${message}`));
  }

  error(message: string): void {
    this.clearSpinner();
    console.error(chalk.red(`✖ ${message}`));
  }

  startSpinner(message: string): void {
    this.spinner = ora(chalk.cyan(message)).start();
  }

  updateSpinner(message: string): void {
    if (this.spinner) {
      this.spinner.text = chalk.cyan(message);
    }
  }

  stopSpinner(success = true, message?: string): void {
    if (this.spinner) {
      if (success) {
        this.spinner.succeed(message ? chalk.green(message) : undefined);
      } else {
        this.spinner.fail(message ? chalk.red(message) : undefined);
      }
      this.spinner = null;
    }
  }

  private clearSpinner(): void {
    if (this.spinner) {
      this.spinner.stop();
      this.spinner = null;
    }
  }
}

export const clilog = new CliLogger();