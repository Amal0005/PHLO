import { SubscriptionDTO } from "@/domain/dto/admin/subscriptionDto";
import { SubscriptionEntity } from "@/domain/entities/subscriptionEntity";

export class SubscriptionDtoMapper {

  static toDTO(entity: SubscriptionEntity): SubscriptionDTO {
    return {
      id: entity._id ?? "",
      subscriptionId: entity.subscriptionId,
      name: entity.name,
      price: entity.price,
      duration: entity.duration,
      features: entity.features,
      isActive: entity.isActive,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }

  static toDTOList(entities: SubscriptionEntity[]): SubscriptionDTO[] {
    return entities.map((entity) => this.toDTO(entity));
  }

}
