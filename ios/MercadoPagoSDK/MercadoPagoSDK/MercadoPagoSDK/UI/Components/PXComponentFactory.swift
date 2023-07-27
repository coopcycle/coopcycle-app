//
//  PXComponentFactory.swift
//  MercadoPagoSDK
//
//  Created by Juan sebastian Sanzone on 7/5/18.
//  Copyright © 2018 MercadoPago. All rights reserved.
//

import Foundation
import MLUI

struct PXComponentFactory {

    struct Modal {
        static func show(viewController: UIViewController, title: String?) {
            if let modalTitle = title {
                MLModal.show(with: viewController, title: modalTitle)
            } else {
                MLModal.show(with: viewController)
            }
        }

        static func show(viewController: UIViewController, title: String? = "", dismissBlock: @escaping (() -> Void)) {
            MLModal.show(with: viewController, title: title, actionTitle: "", actionBlock: {}, secondaryActionTitle: "", secondaryActionBlock: {}, dismiss: dismissBlock, enableScroll: false)
        }

        static func show(viewController: UIViewController, title: String? = "", actionTitle: String? = "", actionBlock: @escaping () -> Void = {}, secondaryActionTitle: String? = "", secondaryActionBlock: @escaping () -> Void = {}, dismissBlock: @escaping (() -> Void) = {}, enableScroll: Bool = false) {
            MLModal.show(with: viewController, title: title, actionTitle: actionTitle, actionBlock: actionBlock, secondaryActionTitle: secondaryActionTitle, secondaryActionBlock: secondaryActionBlock, dismiss: dismissBlock, enableScroll: enableScroll)
        }
    }

    struct Loading {
        static func instance() -> PXLoadingComponent {
            return PXLoadingComponent.shared
        }
    }

    struct Spinner {
        static func new(color1: UIColor, color2: UIColor) -> MLSpinner {
            let spinnerConfig = MLSpinnerConfig(size: .big, primaryColor: color1, secondaryColor: color2)
            return MLSpinner(config: spinnerConfig, text: nil)
        }
    }

    struct SnackBar {
        static func showShortDurationMessage(message: String, dismissBlock: @escaping (() -> Void)) {
            MLSnackbar.show(withTitle: message, type: .error(), duration: .short) { (_) in
                dismissBlock()
            }
        }

        static func showLongDurationMessage(message: String, dismissBlock: @escaping (() -> Void)) {
            MLSnackbar.show(withTitle: message, type: .error(), duration: .long) { (_) in
                dismissBlock()
            }
        }

        static func showPersistentMessage(message: String) {
            MLSnackbar.show(withTitle: message, type: .default(), duration: .indefinitely)
        }
    }
}
