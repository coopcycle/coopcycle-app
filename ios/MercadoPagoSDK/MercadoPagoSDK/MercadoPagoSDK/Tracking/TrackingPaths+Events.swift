//
//  TrackingPaths+Events.swift
//  MercadoPagoSDK
//
//  Created by Eden Torres on 29/10/2018.
//

import Foundation

// MARK: Events
extension TrackingPaths {
    internal struct Events {

        static func getInitPath() -> String {
            return TrackingPaths.pxTrack + "/init"
        }

        // Use this path for any user friction.
        static func getErrorPath() -> String {
            return "/friction"
        }

        static func getCreateTokenPath() -> String {
            return TrackingPaths.pxTrack + "/create_esc_token"
        }

        static func getConfirmPath() -> String {
            return TrackingPaths.pxTrack + "/review/confirm"
        }

        static func getBackPath(screen: String) -> String {
            return screen + "/back"
        }

        static func getAbortPath(screen: String) -> String {
            return screen + "/abort"
        }

        static func getRecognizedCardPath() -> String {
            return TrackingPaths.pxTrack + TrackingPaths.addPaymentMethod + "/number" + "/recognized_card"
        }
    }
}

extension TrackingPaths.Events {
    internal struct OneTap {

        static func getSwipePath() -> String {
            return TrackingPaths.pxTrack + "/review/one_tap/swipe"
        }

        static func getConfirmPath() -> String {
            return TrackingPaths.pxTrack + "/review/confirm"
        }
    }
}

extension TrackingPaths.Events {
    internal struct ReviewConfirm {

        static func getChangePaymentMethodPath() -> String {
            return TrackingPaths.pxTrack + "/review/traditional/change_payment_method"
        }

        static func getConfirmPath() -> String {
            return TrackingPaths.pxTrack + "/review/confirm"
        }
    }
}

// MARK: Congrats events paths.
enum EventsPaths: String {
    case tapScore = "/tap_score"
    case tapDiscountItem = "/tap_discount_item"
    case tapDownloadApp = "/tap_download_app"
    case tapCrossSelling = "/tap_cross_selling"
    case tapSeeAllDiscounts = "/tap_see_all_discounts"
}

// MARK: Congrats events.
extension TrackingPaths.Events {
    internal struct Congrats {

        private static let success = "/success"
        private static let result = TrackingPaths.pxTrack + "/result"

        static func getSuccessPath() -> String {
            return result + success
        }

        static func getSuccessTapScorePath() -> String {
            return getSuccessPath() + EventsPaths.tapScore.rawValue
        }

        static func getSuccessTapDiscountItemPath() -> String {
            return getSuccessPath() + EventsPaths.tapDiscountItem.rawValue
        }

        static func getSuccessTapDownloadAppPath() -> String {
            return getSuccessPath() + EventsPaths.tapDownloadApp.rawValue
        }

        static func getSuccessTapCrossSellingPath() -> String {
            return getSuccessPath() + EventsPaths.tapCrossSelling.rawValue
        }

        static func getSuccessTapSeeAllDiscountsPath() -> String {
            return getSuccessPath() + EventsPaths.tapSeeAllDiscounts.rawValue
        }
    }
}
