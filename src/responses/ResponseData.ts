export class ResponseData {
    constructor(public code: number, public data:any) {
      this.code = code
      this.data = data
    }
    static fetchResource(code:number, data:any){
        return new ResponseData(code, data)
    }
}