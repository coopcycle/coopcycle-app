//
//  PXDownloadAppData.swift
//  MercadoPagoSDK
//
//  Created by AUGUSTO COLLERONE ALFONSO on 18/09/2019.
//

import Foundation
import MLBusinessComponents

class PXDownloadAppData: NSObject, MLBusinessDownloadAppData {

    let discounts: PXDiscounts

    init(discounts: PXDiscounts) {
        self.discounts = discounts
    }

    func getAppSite() -> MLBusinessDownloadAppView.AppSite {
        return MLBusinessDownloadAppView.AppSite.MP
    }

    func getTitle() -> String {
        return discounts.downloadAction.title
    }

    func getButtonTitle() -> String {
        return discounts.downloadAction.action.label
    }

    func getButtonDeepLink() -> String {
        return discounts.downloadAction.action.target
    }
}
