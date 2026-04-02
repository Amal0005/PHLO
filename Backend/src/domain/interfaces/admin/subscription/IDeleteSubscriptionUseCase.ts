export interface IDeleteSubscriptionUseCase{
    deleteSubscription(id:string):Promise<void>
}