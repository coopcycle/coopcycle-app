//
//  PXCardSliderSizeManager.swift
//
//  Created by Juan sebastian Sanzone on 12/10/18.
//

import UIKit

struct PXCardSliderSizeManager {

    static let goldenRatio: CGFloat = 1/1.586
    static let interItemSpace: CGFloat = 16
    static let cardDeltaDecrease: CGFloat = 60

    static func getGoldenRatioSize(_ forWidth: CGFloat) -> CGSize {
        return CGSize(width: forWidth, height: forWidth*goldenRatio)
    }

    static func getHeaderViewHeight(viewController: UIViewController) -> CGFloat {
        if UIDevice.isSmallDevice() {
            return PXLayout.getAvailabelScreenHeight(in: viewController, applyingMarginFactor: 38)
        } else if UIDevice.isLargeOrExtraLargeDevice() {
            return PXLayout.getAvailabelScreenHeight(in: viewController, applyingMarginFactor: 46)
        } else {
            return PXLayout.getAvailabelScreenHeight(in: viewController, applyingMarginFactor: 40)
        }
    }

    static func getWhiteViewHeight(viewController: UIViewController) -> CGFloat {
        if UIDevice.isSmallDevice() {
            return PXLayout.getAvailabelScreenHeight(in: viewController, applyingMarginFactor: 62)
        } else if UIDevice.isLargeOrExtraLargeDevice() {
            return PXLayout.getAvailabelScreenHeight(in: viewController, applyingMarginFactor: 54)
        } else {
            return PXLayout.getAvailabelScreenHeight(in: viewController, applyingMarginFactor: 60)
        }
    }
}
