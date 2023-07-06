//
//  PXOneTapHeaderViewModel.swift
//  MercadoPagoSDK
//
//  Created by Juan sebastian Sanzone on 5/11/18.
//

import UIKit

class PXOneTapHeaderViewModel {
    let icon: UIImage
    let title: String
    let subTitle: String?
    let data: [PXOneTapSummaryRowData]
    let splitConfiguration: PXSplitConfiguration?

    init(icon: UIImage, title: String, subTitle: String?, data: [PXOneTapSummaryRowData], splitConfiguration: PXSplitConfiguration?) {
        self.icon = icon
        self.title = title
        self.subTitle = subTitle
        self.data = data
        self.splitConfiguration = splitConfiguration
    }

    internal func hasLargeHeaderOrLarger() -> Bool {
        return self.splitConfiguration != nil && self.isLargeSummaryOrLarger()
    }

    internal func hasMediumHeaderOrLarger() -> Bool {
        let splitCondition = self.splitConfiguration != nil && self.isMediumSummaryOrLarger()
        let noSplitCondition = self.isLargeSummaryOrLarger()
        let hasMediumHeader = splitCondition || noSplitCondition
        return hasMediumHeader
    }

    private func isLargeSummaryOrLarger() -> Bool {
        var chargeFound = false
        var discountFound = false
        for item in data {
            if item.type == .charges {
                chargeFound = true
            }

            if item.type == .discount {
                discountFound = true
            }
        }
        return chargeFound && discountFound
    }

    private func isMediumSummaryOrLarger() -> Bool {
        for item in data {
            if item.type == .charges || item.type == .discount {
                return true
            }
        }
        return false
    }
}
