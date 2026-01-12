import { CreatorEntity } from "../../entities/creatorEntities";

export interface IadminCreatorListingUseCase {
  getAllCreators(): Promise<CreatorEntity[]>;
}
