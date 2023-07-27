//
//  PXCheckoutPreference+AdditionalInfo.swift
//  MercadoPagoSDK
//
//  Created by Juan sebastian Sanzone on 4/8/19.
//

import Foundation

internal extension PXCheckoutPreference {
    func populateAdditionalInfoModel() {
        if let str = self.additionalInfo, let additionInfoData = str.data(using: .utf8) {
            self.pxAdditionalInfo = try? JSONDecoder().decode(PXAdditionalInfo.self, from: additionInfoData)
        }
    }

    func getAdditionalInfoModel() -> PXAdditionalInfo? {
        return pxAdditionalInfo
    }
}
