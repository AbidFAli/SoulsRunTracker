export class EnvironmentVariables{
  public static readonly BACKEND_PORT: number = parseInt(process.env.BACKEND_PORT ?? "-1",10);

  static {
    if(EnvironmentVariables.BACKEND_PORT === -1){
      throw new Error("process.env.BACKEND_PORT not set")
    }
  }

}