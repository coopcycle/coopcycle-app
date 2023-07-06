//
//  PXNotificationManager.swift
//  MercadoPagoSDK
//
//  Created by Demian Tejo on 25/4/18.
//  Copyright © 2018 MercadoPago. All rights reserved.
//

import Foundation

struct PXAnimatedButtonNotificationObject {
    var status: String
    var statusDetail: String?
}

struct PXNotificationManager {

}

extension PXNotificationManager {
    struct SuscribeTo {
        static func attemptToClose(_ observer: Any, selector: Selector) {
            let notificationCenter = NotificationCenter.default
            notificationCenter.addObserver(observer, selector: selector, name: .attemptToClose, object: nil)
        }

        static func animateButton(_ observer: Any, selector: Selector) {
            let notificationCenter = NotificationCenter.default
            notificationCenter.addObserver(observer, selector: selector, name: .animateButton, object: nil)
        }

        static func cardFormReset(_ observer: Any, selector: Selector) {
            let notificationCenter = NotificationCenter.default
            notificationCenter.addObserver(observer, selector: selector, name: .cardFormReset, object: nil)
        }

    }
}

extension PXNotificationManager {
    struct UnsuscribeTo {
        static func attemptToClose(_ observer: Any) {
            let notificationCenter = NotificationCenter.default
            notificationCenter.removeObserver(observer, name: .attemptToClose, object: nil)
        }

        static func animateButton(_ observer: Any?) {
            guard let observer = observer else {
                return
            }
            let notificationCenter = NotificationCenter.default
            notificationCenter.removeObserver(observer, name: .animateButton, object: nil)
        }
    }
}

extension PXNotificationManager {
    struct Post {
        static func attemptToClose() {
            let notificationCenter = NotificationCenter.default
            notificationCenter.post(name: .attemptToClose, object: nil)
        }

        static func animateButton(with object: PXAnimatedButtonNotificationObject) {
            let notificationCenter = NotificationCenter.default
            notificationCenter.post(name: .animateButton, object: object)
        }

        static func cardFormReset() {
            let notificationCenter = NotificationCenter.default
            notificationCenter.post(name: .cardFormReset, object: nil)
        }
    }
}

internal extension NSNotification.Name {
    static let attemptToClose = Notification.Name(rawValue: "PXAttemptToClose")
    static let animateButton = Notification.Name(rawValue: "PXAnimateButton")
    static let cardFormReset = Notification.Name(rawValue: "PXCardFormReset")
}
