//
//  SiteHandler.swift
//  MercadoPagoSDK
//
//  Created by Eden Torres on 16/08/2018.
//  Copyright © 2018 MercadoPago. All rights reserved.
//

import Foundation

internal class SiteManager {

    // TODO: REMOVE FORCE
    private var site: PXSite?
    private var currency: PXCurrency!
    static let shared = SiteManager()

    func setSite(site: PXSite) {
        self.site = site
    }

    func getTermsAndConditionsURL() -> String {
        return site?.termsAndConditionsUrl ?? ""
    }

    func setCurrency(currency: PXCurrency) {
        self.currency = currency
    }

    func getCurrency() -> PXCurrency {
        return currency
    }

    func getSiteId() -> String {
        return site?.id ?? ""
    }

    func getSite() -> PXSite? {
        return site
    }
}
