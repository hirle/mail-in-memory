export interface LogsConfig {
    dir: string
    retention: string
    level?: string
  }

export interface DatabaseConfig {
    filename: string
} 


export default interface Config {
    smtpPortNumber: number,
    httpPortNumber: number,
    db: DatabaseConfig,
    logs?: LogsConfig
  }
  
  