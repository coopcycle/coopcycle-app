//
//  PXDiscountItemData.swift
//  MercadoPagoSDK
//
//  Created by AUGUSTO COLLERONE ALFONSO on 13/09/2019.
//

import UIKit
import MLBusinessComponents

class PXDiscountItemData: NSObject, MLBusinessSingleItemProtocol {
    let item: PXDiscountsItem

    init(item: PXDiscountsItem) {
        self.item = item
    }

    func titleForItem() -> String {
        return item.title
    }

    func subtitleForItem() -> String {
        return item.subtitle
    }

    func iconImageUrlForItem() -> String {
        return item.icon
    }

    func deepLinkForItem() -> String? {
        return item.target
    }

    func trackIdForItem() -> String? {
        return item.campaingId
    }
    
    func eventDataForItem() -> [String : Any]? {
        guard let campaignId = item.campaingId else { return nil }
        return ["tracking_id" : campaignId ]
    }
}
