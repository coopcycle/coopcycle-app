//
//  PXImageService.swift
//  MercadoPagoSDK
//
//  Created by AUGUSTO COLLERONE ALFONSO on 5/3/18.
//  Copyright © 2018 MercadoPago. All rights reserved.
//

import Foundation

final class PXImageService: NSObject {

    class func getIconImageFor(paymentMethod: PXPaymentMethod) -> UIImage? {

        guard paymentMethod.paymentTypeId != PXPaymentTypes.PAYMENT_METHOD_PLUGIN.rawValue else {
            return paymentMethod.getImageForExtenalPaymentMethod()
        }

        let dictPM = ResourceManager.shared.getDictionaryForResource(named: "PaymentMethodSearch")

        if let pm = dictPM?.value(forKey: paymentMethod.id) as? NSDictionary {
            return ResourceManager.shared.getImage(pm.object(forKey: "image_name") as? String)
        } else if let pmPt = dictPM?.value(forKey: paymentMethod.id + "_" + paymentMethod.paymentTypeId) as? NSDictionary {
            return ResourceManager.shared.getImage(pmPt.object(forKey: "image_name") as? String)
        }

        return nil
    }
}
