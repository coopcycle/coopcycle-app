//
//  PXCrossSellingItemData.swift
//  MercadoPagoSDK
//
//  Created by AUGUSTO COLLERONE ALFONSO on 23/09/2019.
//

import Foundation
import MLBusinessComponents

class PXCrossSellingItemData: NSObject, MLBusinessCrossSellingBoxData {
    let item: PXCrossSellingItem

    init(item: PXCrossSellingItem) {
        self.item = item
    }

    func getIconUrl() -> String {
        return item.icon
    }

    func getText() -> String {
        return item.title
    }

    func getButtonTitle() -> String {
        return item.action.label
    }

    func getButtonDeepLink() -> String {
        return item.action.target
    }
}

class CrossSellingBoxData: NSObject, MLBusinessCrossSellingBoxData {

    func getIconUrl() -> String {
        return "https://urbancomunicacion.com/wp-content/uploads/2017/04/Logotipos-famosos-Starbucks-Urban-comunicacion-1.png"
    }
    func getText() -> String {
        return "Ganá $ 50 de regalo para tus pagos diarios"
    }
    func getButtonTitle() -> String {
        return "Invita a más amigos a usar la app"
    }
    func getButtonDeepLink() -> String {
        return "https://mercadopago-crossSelling"
    }
}
