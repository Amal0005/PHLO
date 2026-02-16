import { UserResponseDto } from "../../../domain/dto/user/userResponseDto";
import { User } from "../../../domain/entities/userEntities";

export class UserMapper {
  static toDto(user: User): UserResponseDto {
    return {
      _id: user._id!,
      name: user.name,
      email: user.email,
      phone: user.phone,
      status: user.status,
      role: user.role,
      image: user.image,
      googleVerified: user.googleVerified,
      createdAt: user.createdAt,
    };
  }

  static toDomain(doc: any): User {
    return {
      _id: doc._id.toString(),
      name: doc.name,
      email: doc.email,
      password: doc.password,
      phone: doc.phone,
      googleId: doc.googleId,
      image: doc.image,
      status: doc.status,
      role: doc.role,
      googleVerified: doc.googleVerified,
      createdAt: doc.createdAt,
    };
  }
}
