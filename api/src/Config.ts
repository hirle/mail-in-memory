export interface LogsConfig {
    dir: string
    retention: number
    level?: string
  }

export interface DatabaseConfig {
    filename: string
} 


export default interface Config {
    "smtp-port": number,
    "http-port": number,
    db: DatabaseConfig,
    logs?: LogsConfig
  }
  
  