export default abstract class Handler {
  protected simultaneity = 1

  public getSimultaneity() {
    return this.simultaneity
  }

  public abstract handle(message: any): Promise<void>
}
