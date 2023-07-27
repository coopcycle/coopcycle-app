//
//  PXPropertyStoring.swift
//  MercadoPagoSDK
//
//  Created by Juan sebastian Sanzone on 17/7/18.
//  Copyright © 2018 MercadoPago. All rights reserved.
//

import Foundation

// Stored properties
internal protocol PXPropertyStoring {
    associatedtype CustomT
    func getAssociatedObject(_ key: UnsafeRawPointer, defaultValue: CustomT) -> CustomT
}

extension PXPropertyStoring {
    func getAssociatedObject(_ key: UnsafeRawPointer, defaultValue: CustomT) -> CustomT {
        guard let value = objc_getAssociatedObject(self, key) as? CustomT else {
            return defaultValue
        }
        return value
    }
}
