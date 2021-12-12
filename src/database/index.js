import cls from "cls-hooked";
import {Sequelize} from "sequelize/dist";

export default class Database {
  constructor(environment, dbConfig) {
    this.environment = environment;
    this.dbConfig = dbConfig;
    this.isTestEnviroment = this.environment === 'test';

  } 
  async connect() {
    // set up namespace for transactions
    const namespace = cls.createNamespace('transactions namespace');
    Sequelize.useCLS(namespace);

    // Create the connection
    const {username, password, host, port, database, dialect} = this.dbConfig(this.environment)
    this.connection = new Sequelize({ username, password, host, port, database, dialect, logging: this.isTestEnviroment ? false : console.log })
    // Check if we connected succesfully
    await this.connection.authenticate({ logging: false });
    if(this.isTestEnviroment){
      console.log('Connection to the database has been established successfully');
    }

    // Register the models
    registerModels(this.connection);

    // Sync the models
    await this.sync();
  }

  async disconnect() {
    await this.connection.close();
  }

  async sync() {
    await this.connection.sync(
      {
        logging: false,
        force: this.isTestEnviroment,
      }
    );

    if (!this.isTestEnviroment) {
      console.log('Connection synced successfully');
    }
  }
}
