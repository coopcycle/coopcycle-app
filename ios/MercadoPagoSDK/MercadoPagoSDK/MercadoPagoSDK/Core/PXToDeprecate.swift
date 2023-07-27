//
//  PXToDeprecate.swift
//  MercadoPagoSDK
//
//  Created by Juan sebastian Sanzone on 31/7/18.
//  Copyright © 2018 MercadoPago. All rights reserved.
//

import Foundation

extension MercadoPagoCheckout {
    internal class func showPayerCostDescription() -> Bool {
        let dictionary = ResourceManager.shared.getDictionaryForResource(named: "PayerCostPreferences")
        let site = SiteManager.shared.getSiteId()

        if let siteDic = dictionary?.value(forKey: site) as? NSDictionary {
            if let payerCostDescription = siteDic.value(forKey: "payerCostDescription") as? Bool {
                return payerCostDescription
            }
        }

        return true
    }

    internal class func showBankInterestWarning() -> Bool {
        let dictionary = ResourceManager.shared.getDictionaryForResource(named: "PayerCostPreferences")
        let site = SiteManager.shared.getSiteId()

        if let siteDic = dictionary?.value(forKey: site) as? NSDictionary {
            if let bankInsterestCell = siteDic.value(forKey: "bankInsterestCell") as? Bool {
                return bankInsterestCell
            }
        }

        return false
    }
}
