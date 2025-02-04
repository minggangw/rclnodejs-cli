/* eslint-disable no-underscore-dangle */
const { exec } = require('child_process');
const path = require('path');

class PkgCreator {
  configureCli(cli) {
    const createPkgCmd = cli.command('create-package <package-name>');
    createPkgCmd
      .usage('<package_name> [options...]')
      .description('Create a ROS2 package for Nodejs development.')
      // .option('--rclnodejs-version <x.y.z>', 'The version of rclnodejs to use')
      .option('--description <description>', 'The description given in the package.xml')
      .option('--destination-directory <directory_path>', 'Directory where to create the package directory')
      .option('--license <license>', 'The license attached to this package')
      .option('--maintainer-email <email>', 'email address of the maintainer of this package')
      .option('--maintainer-name <name>', 'name of the maintainer of this package')
      .option('--typescript', 'Configure as a TypeScript Node.js project')
      .option('--no-init', 'Do not run "npm init"')
      .option('--dependencies <ros_packages...>', 'list of ROS dependencies')
      .action((packageName, options) => {
        this.createPackage(packageName, options);
      });
  }

  createPackage(packageName, options) {
    const cmd = this._createExecCmd(packageName, options);
    this._runCmd(cmd);
  }

  // eslint-disable-next-line class-methods-use-this
  _createExecCmd(packageName, options) {
    const isWin = process.platform === 'win32';
    const script = isWin ? 'create_ros_nodejs_pkg.bat' : 'create_ros_nodejs_pkg.sh';

    let cmd = path.join(__dirname, '..', 'scripts', script);
    cmd += ` ${packageName}`;

    // if (options.rclnodejsVersion) {
    //   cmd += ` --rclnodejs-version "${options.rclnodejsVersion}"`;
    // }

    if (options.description) {
      cmd += ` --description "${options.description}"`;
    }

    if (options.destinationDirectory) {
      cmd += ` --destination-directory "${options.destinationDirectory}"`;
    }

    if (options.license) {
      cmd += ` --license "${options.license}"`;
    }

    if (options.maintainerEmail) {
      cmd += ` --maintainer-email "${options.maintainerEmail}"`;
    }

    if (options.maintainerName) {
      cmd += ` --maintainer-name "${options.maintainerName}"`;
    }

    if (options.typescript) {
      cmd += ' --typescript';
    }

    if (options.dependencies) {
      cmd += ` --dependencies ${options.dependencies}`;
    }

    return cmd;
  }

  // eslint-disable-next-line class-methods-use-this
  _runCmd(cmd) {
    const child = exec(cmd);
    child.stdout.on('data', (data) => {
      console.log(data);
    });
    child.stderr.on('err', (data) => {
      console.warn(data);
    });
  }
}

module.exports = PkgCreator;
