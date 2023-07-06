//
//  EntityType.swift
//  MercadoPagoSDK
//
//  Created by AUGUSTO COLLERONE ALFONSO on 3/9/17.
//  Copyright © 2017 MercadoPago. All rights reserved.
//

import Foundation

internal class EntityType: NSObject, Cellable {

    var objectType: ObjectTypes = ObjectTypes.entityType
    var entityTypeId: String!
    var name: String!
}
