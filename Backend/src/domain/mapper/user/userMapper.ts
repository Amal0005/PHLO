import { UserResponseDto } from "../../dto/user/auth/userResponseDto";
import { User } from "../../entities/userEntities";

export class UserMapper{
    static toDto(user:User):UserResponseDto{
        return{
      _id: user._id!,
      name: user.name,
      email: user.email,
      phone: user.phone,
      status: user.status,
      role: user.role,
      googleVerified: user.googleVerified,
      lastLogin: user.lastLogin,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
        }
    }
}