//
//  PXFinancialInstitution+Business.swift
//  MercadoPagoSDKV4
//
//  Created by Eden Torres on 30/07/2018.
//

import Foundation

extension PXFinancialInstitution: Cellable {
    var objectType: ObjectTypes {
        get {
            return ObjectTypes.financialInstitution
        }
        set {
            self.objectType = ObjectTypes.financialInstitution
        }
    }
}
