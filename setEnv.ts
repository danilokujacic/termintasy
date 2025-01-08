const setEnv = () => {
  const fs = require('fs');
  const writeFile = fs.writeFile;
  // Configure Angular `environment.ts` file path
  const targetPath = './apps/termintasy/src/app/environments/environment.ts';
  // Load node modules
  const colors = require('colors');
  require('dotenv').config({
    path: '.env',
  });
  // `environment.ts` file structure
  const envConfigFile = `export const environment = {
  clientId: '${process.env.CLIENT_ID}',
  clientSecret: '${process.env.CLIENT_SECRET}',
  apiUrl: '${process.env.API_URL}',
  production: true,
};
`;
  console.log(
    colors.magenta(
      'The file `environment.ts` will be written with the following content: \n'
    )
  );
  writeFile(targetPath, envConfigFile, (err: any) => {
    if (err) {
      console.error(err);
      throw err;
    } else {
      console.log(
        colors.magenta(
          `Angular environment.ts file generated correctly at ${targetPath} \n`
        )
      );
    }
  });
};

setEnv();
