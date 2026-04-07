import { TokenController } from "@/adapters/controllers/tokenController";
import { LogoutController } from "@/adapters/controllers/logoutController";
import { UserAuthController } from "@/adapters/controllers/user/auth/authController";
import { GoogleAuthController } from "@/adapters/controllers/user/auth/googleAuthController";
import { userLoginController } from "@/adapters/controllers/user/auth/userLoginController";
import { userRegisterController } from "@/adapters/controllers/user/auth/userRegisterController";
import { CreatorRepository } from "@/adapters/repository/creator/creatorRepository";
import { UserRepository } from "@/adapters/repository/user/userRepository";
import { TokenBlacklistService } from "@/domain/services/tokenBlacklistService";
import { JwtServices } from "@/domain/services/user/jwtServices";
import { MailService } from "@/domain/services/user/mailServices";
import { OtpServices } from "@/domain/services/user/otpServices";
import { PasswordService } from "@/domain/services/user/passwordService";
import { PendingUserService } from "@/domain/services/user/pedingUserService";
import { RedisService } from "@/domain/services/user/redisServices";
import { UserProfileController } from "@/adapters/controllers/user/profile/userProfileController";
import { CategoryRepository } from "@/adapters/repository/admin/categoryRepository";
import { AdminCategoryListingUseCase } from "@/application/useCases/admin/category/adminCategoryListingUseCase";
import { AddCategoryUseCase } from "@/application/useCases/admin/category/addCategoryUseCase";
import { EditCategoryUseCase } from "@/application/useCases/admin/category/editCategoryUseCase";
import { DeleteCategoryUseCase } from "@/application/useCases/admin/category/deleteCategoryUseCase";
import { CategoryController } from "@/adapters/controllers/admin/categoryController";
import { LogoutUseCase } from "@/application/useCases/logoutUseCase";
import { ForgotPasswordUseCase } from "@/application/useCases/user/auth/forgotPasswordUseCase";
import { GoogleLoginUseCase } from "@/application/useCases/user/auth/googleLoginUseCase";
import { ResendOtpUseCase } from "@/application/useCases/user/auth/resendOtpUseCase";
import { ResetPasswordUseCase } from "@/application/useCases/user/auth/resetPasswordUseCase";
import { VerifyForgotOtpUseCase } from "@/application/useCases/user/auth/verifyForgotOtpUseCase";
import { userLoginUserUseCase } from "@/application/useCases/user/auth/loginUserUseCase";
import { userRegisterUseCase } from "@/application/useCases/user/auth/registerUserUseCase";
import { verifyRegisterOtpUseCase } from "@/application/useCases/user/auth/verifyRegisterOtpUseCase";
import { RefreshTokenUseCase } from "@/application/useCases/user/auth/refreshTokenUseCase";
import { GetUserProfileUseCase } from "@/application/useCases/user/profile/getUserProfileUseCase";
import { GetProfileController } from "@/adapters/controllers/user/profile/getProfileController";
import { EditProfileController } from "@/adapters/controllers/user/profile/editProfileController";
import { ChangePasswordController } from "@/adapters/controllers/user/profile/changePasswordController";
import { EditUserProfileUsecase } from "@/application/useCases/user/profile/editUserProfileUseCase";
import { ChangePasswordUseCase } from "@/application/useCases/user/profile/changePasswordUseCase";
import { CheckEmailUseCase } from "@/application/useCases/user/profile/checkEmailUseCase";
import { VerifyEmailChangeOtpUseCase } from "@/application/useCases/user/profile/verifyEmailChangeOtpUseCase";
import { HandleStripeWebhookUseCase } from "@/application/useCases/payment/HandleStripeWebhookUseCase";
import { UserPackageController } from "@/adapters/controllers/user/userPackageController";
import { ListUserPackagesUseCase } from "@/application/useCases/user/package/listUserPackagesUseCase";
import { PackageRepository } from "@/adapters/repository/creator/packageRepository";
import { GetPackageDetailUseCase } from "@/application/useCases/user/package/getPackageDetailUseCase";
import { BookingRepository } from "@/adapters/repository/user/bookingRepository";
import { SubscriptionRepository } from "@/adapters/repository/admin/subscriptionRepository";
import { StripeService } from "@/domain/services/stripeService";
import { CreateBookingUseCase } from "@/application/useCases/user/booking/createBookingUseCase";
import { PaymentController } from "@/adapters/controllers/paymentController";
import { UserWalletController } from "@/adapters/controllers/user/userWalletController";
import { BookingWebhookUseCase } from "@/application/useCases/user/booking/bookingWebhookUseCase";
import { CreatorSubscriptionWebhookUseCase } from "@/application/useCases/creator/subscription/creatorSubscriptionWebhookUseCase";
import { ListBookingUseCase } from "@/application/useCases/user/booking/listbookingUseCase";
import { CheckAvailabilityUseCase } from "@/application/useCases/user/booking/checkAvailabilityUseCase";
import { CancelBookingUseCase } from "@/application/useCases/user/booking/cancelBookingUseCase";
import { GetBookingDetailUseCase } from "@/application/useCases/user/booking/getBookingDetailUseCase";
import { UserBookingController } from "@/adapters/controllers/user/userBookingController";
import { GetApprovedWallpaperUseCase } from "@/application/useCases/user/wallpaper/getApprovedWallpaperUseCase";
import { WallpaperRepository } from "@/adapters/repository/creator/wallpaperRepository";
import { UserWallpaperController } from "@/adapters/controllers/user/userWallpaperController";
import { RecordDownloadUseCase } from "@/application/useCases/creator/wallpaper/recordDownloadUseCase";
import { WallpaperDownloadRepository } from "@/adapters/repository/creator/wallpaperDownloadRepository";
import { WishlistRepository } from "@/adapters/repository/user/wishlistRepository";
import { ToggleWishlistUseCase } from "@/application/useCases/user/wishlist/toggleWishlistUseCase";
import { GetWishlistUseCase } from "@/application/useCases/user/wishlist/getWishlistUseCase";
import { GetWishlistIdsUseCase } from "@/application/useCases/user/wishlist/getWishlistIdsUseCase";
import { WishlistController } from "@/adapters/controllers/user/wishlistController";
import { PdfInvoiceGenerator } from "@/domain/services/user/PdfInvoiceGenerator";
import { DownloadInvoiceUseCase } from "@/application/useCases/user/booking/DownloadInvoiceUseCase";
import { ReviewRepository } from "@/adapters/repository/user/reviewRepository";
import { AddReviewUseCase } from "@/application/useCases/user/review/addReviewUseCase";
import { ReviewController } from "@/adapters/controllers/user/userReviewController";
import { DeleteReviewUseCase } from "@/application/useCases/user/review/deleteReviewUseCase";
import { GetReviewUseCase } from "@/application/useCases/user/review/getReviewUseCase";
import { GetReviewByBookingUseCase } from "@/application/useCases/user/review/getReviewByBookingUseCase";
import { EditReviewUseCase } from "@/application/useCases/user/review/editReviewUseCase";
import { BuyWallpaperUseCase } from "@/application/useCases/user/wallpaper/buyWallpaperUseCase";
import { WallpaperWebhookUseCase } from "@/application/useCases/user/wallpaper/wallpaperWebhookUseCase";
import { RetryPaymentUseCase } from "@/application/useCases/user/booking/retryPaymentUseCase";
import { LeaveRepository } from "@/adapters/repository/creator/leaveRepository";
import { jwtAuthMiddleware } from "@/adapters/middlewares/jwtAuthMiddleware";
import { CreditWalletUseCase } from "@/application/useCases/wallet/creditWalletUseCase";
import { GetWalletUseCase } from "@/application/useCases/wallet/getWalletUseCase";
import { WalletRepository } from "@/adapters/repository/walletRepository";
import { UserCreatorController } from "@/adapters/controllers/user/userCreatorController";
import { AdminCreatorListingUseCase } from "@/application/useCases/admin/adminCreatorListingUseCase";
import { GetCreatorProfileUseCase } from "@/application/useCases/creator/profile/getCreatorProfileUseCase";



import { ChatRepository } from "@/adapters/repository/chatRepository";
import { sendNotificationUseCase } from "@/framework/depInjection/notificationInjections";

const userRepo = new UserRepository();
const passwordServices = new PasswordService();
const redisService = new RedisService()
const otpServices = new OtpServices(redisService)
const pendingService = new PendingUserService(redisService)
const jwtService = new JwtServices()
const mailService = new MailService()
const tokenBlacklistService = new TokenBlacklistService(redisService)
const creatorRepository = new CreatorRepository()
const packageRepository = new PackageRepository()
const categoryRepository = new CategoryRepository();
const bookingRepo = new BookingRepository()
const subscriptionRepo = new SubscriptionRepository()
const wallpaperRepo = new WallpaperRepository()
const stripeService = new StripeService()
const chatRepo = new ChatRepository()
const wallpaperDownloadRepo = new WallpaperDownloadRepository()
const wishlistRepo = new WishlistRepository()
const reviewRepo = new ReviewRepository()
const leaveRepo = new LeaveRepository()
const walletRepo = new WalletRepository()

const creditWalletUseCase = new CreditWalletUseCase(walletRepo)
const registerUseCase = new userRegisterUseCase(userRepo, creatorRepository, passwordServices, otpServices, mailService, redisService);
const loginUseCase = new userLoginUserUseCase(userRepo, passwordServices, jwtService);
const verifyOtpUseCase = new verifyRegisterOtpUseCase(userRepo, otpServices, pendingService, sendNotificationUseCase)
const resendOtpUsecase = new ResendOtpUseCase(otpServices, mailService)
const forgotPasswordUseCase = new ForgotPasswordUseCase(userRepo, otpServices, mailService)
const verifyForgotOtpUseCase = new VerifyForgotOtpUseCase(otpServices, redisService)
const resetPasswordUseCase = new ResetPasswordUseCase(userRepo, passwordServices, redisService)
const googleLoginUseCase = new GoogleLoginUseCase(userRepo, jwtService)
const logoutUseCase = new LogoutUseCase(tokenBlacklistService)
const refreshTokenUseCase = new RefreshTokenUseCase(jwtService)
const getUserProfileUseCase = new GetUserProfileUseCase(userRepo)
const editUserProfileUseCase = new EditUserProfileUsecase(userRepo, creatorRepository)
const changePasswordUseCase = new ChangePasswordUseCase(userRepo, passwordServices)
const checkEmailUseCase = new CheckEmailUseCase(userRepo, creatorRepository)
const verifyEmailChangeOtpUseCase = new VerifyEmailChangeOtpUseCase(otpServices)
const listUserPackagesUseCase = new ListUserPackagesUseCase(packageRepository)
const getPackageDetailUseCase = new GetPackageDetailUseCase(packageRepository);
const adminCategoryListingUseCase = new AdminCategoryListingUseCase(categoryRepository);
const addCategoryUseCase = new AddCategoryUseCase(categoryRepository);
const editCategoryUseCase = new EditCategoryUseCase(categoryRepository);
const deleteCategoryUseCase = new DeleteCategoryUseCase(categoryRepository);
const createBookingUseCase = new CreateBookingUseCase(bookingRepo, packageRepository, leaveRepo, stripeService)
const bookingWebhookUseCase = new BookingWebhookUseCase(bookingRepo, stripeService, packageRepository, creatorRepository, creditWalletUseCase, chatRepo, sendNotificationUseCase, userRepo)
const creatorSubscriptionWebhookUseCase = new CreatorSubscriptionWebhookUseCase(creatorRepository, subscriptionRepo, stripeService, mailService, creditWalletUseCase, sendNotificationUseCase, userRepo)
const listBookingsUseCase = new ListBookingUseCase(bookingRepo);
const checkAvailabilityUseCase = new CheckAvailabilityUseCase(bookingRepo, leaveRepo, packageRepository);
const cancelBookingUseCase = new CancelBookingUseCase(bookingRepo, packageRepository, sendNotificationUseCase, walletRepo);
const getBookingDetailUseCase = new GetBookingDetailUseCase(bookingRepo, stripeService);
const getApprovedWallpapers = new GetApprovedWallpaperUseCase(wallpaperRepo, wallpaperDownloadRepo)
const recordDownloadUseCase = new RecordDownloadUseCase(wallpaperDownloadRepo, wallpaperRepo)
const toggleWishlistUseCase = new ToggleWishlistUseCase(wishlistRepo)
const getWishlistUseCase = new GetWishlistUseCase(wishlistRepo)
const getWishlistIdsUseCase = new GetWishlistIdsUseCase(wishlistRepo)
const pdfInvoiceGenerator = new PdfInvoiceGenerator();
const downloadInvoiceUseCase = new DownloadInvoiceUseCase(bookingRepo, pdfInvoiceGenerator);
const addReviewUseCase = new AddReviewUseCase(reviewRepo, bookingRepo)
const deleteReviewUseCase = new DeleteReviewUseCase(reviewRepo)
const getReviewUseCase = new GetReviewUseCase(reviewRepo)
const getReviewByBookingUseCase = new GetReviewByBookingUseCase(reviewRepo)
const editReviewUseCase = new EditReviewUseCase(reviewRepo)
const buyWallpaperUseCase = new BuyWallpaperUseCase(wallpaperRepo, stripeService, wallpaperDownloadRepo)
const wallpaperWebhookUseCase = new WallpaperWebhookUseCase(wallpaperDownloadRepo, wallpaperRepo, creatorRepository, creditWalletUseCase, sendNotificationUseCase, userRepo, walletRepo)

const retryPaymentUseCase = new RetryPaymentUseCase(bookingRepo, packageRepository, stripeService);

const handleStripeWebhookUseCase = new HandleStripeWebhookUseCase(stripeService, bookingWebhookUseCase, creatorSubscriptionWebhookUseCase, wallpaperWebhookUseCase);
const getWalletUseCase = new GetWalletUseCase(walletRepo);
const adminCreatorListingUseCase = new AdminCreatorListingUseCase(creatorRepository);
const getCreatorProfileUseCase = new GetCreatorProfileUseCase(creatorRepository);

export const registerController = new userRegisterController(registerUseCase, verifyOtpUseCase, resendOtpUsecase);
export const loginController = new userLoginController(loginUseCase);
export const userAuthController = new UserAuthController(forgotPasswordUseCase, verifyForgotOtpUseCase, resetPasswordUseCase)
export const userGoogleController = new GoogleAuthController(googleLoginUseCase)
export const logoutController = new LogoutController(logoutUseCase)
export const tokenController = new TokenController(refreshTokenUseCase)
export const getProfileController = new GetProfileController(getUserProfileUseCase)
export const editProfileController = new EditProfileController(editUserProfileUseCase)
export const changePasswordController = new ChangePasswordController(changePasswordUseCase)
export const userPackageController = new UserPackageController(listUserPackagesUseCase, getPackageDetailUseCase)
export const getCategoryController = new CategoryController(addCategoryUseCase, editCategoryUseCase, deleteCategoryUseCase, adminCategoryListingUseCase);
export const userProfileController = new UserProfileController(getUserProfileUseCase, editUserProfileUseCase, changePasswordUseCase, checkEmailUseCase, verifyEmailChangeOtpUseCase);
export const userBookingController = new UserBookingController(createBookingUseCase, listBookingsUseCase, checkAvailabilityUseCase, cancelBookingUseCase, getBookingDetailUseCase, downloadInvoiceUseCase, retryPaymentUseCase);
export const paymentController = new PaymentController(handleStripeWebhookUseCase);
export const userWallpaperController = new UserWallpaperController(getApprovedWallpapers, recordDownloadUseCase, buyWallpaperUseCase)
export const wishlistController = new WishlistController(toggleWishlistUseCase, getWishlistUseCase, getWishlistIdsUseCase)
export const reviewController = new ReviewController(addReviewUseCase, deleteReviewUseCase, getReviewUseCase, getReviewByBookingUseCase, editReviewUseCase)
export const userWalletController = new UserWalletController(getWalletUseCase);
export const userCreatorController = new UserCreatorController(adminCreatorListingUseCase, getCreatorProfileUseCase);
export const authMiddleware = jwtAuthMiddleware(jwtService, tokenBlacklistService, userRepo, creatorRepository);
