//
//  AdditionalStepCellFactory.swift
//  MercadoPagoSDK
//
//  Created by AUGUSTO COLLERONE ALFONSO on 4/6/17.
//  Copyright © 2017 MercadoPago. All rights reserved.
//

import Foundation
import UIKit

class AdditionalStepCellFactory: NSObject {

    open class func buildCell(object: Cellable, width: Double, height: Double) -> UITableViewCell {

        guard let bundle = ResourceManager.shared.getBundle() else { return UITableViewCell() }

        if object.objectType == ObjectTypes.payerCost {

            guard let payerCost = object as? PXPayerCost else { return UITableViewCell() }

            if let cell = bundle.loadNibNamed("PayerCostRowTableViewCell", owner: nil, options: nil)?[0] as? PayerCostRowTableViewCell {
                let showDescription = MercadoPagoCheckout.showPayerCostDescription()
                cell.fillCell(payerCost: payerCost, showDescription: showDescription)
                cell.addSeparatorLineToBottom(width: width, height: height)
                cell.selectionStyle = .none
                return cell
            }
        }

        if object.objectType == ObjectTypes.issuer {
            if let cell = bundle.loadNibNamed("IssuerRowTableViewCell", owner: nil, options: nil)?[0] as? IssuerRowTableViewCell, let issuerObj = object as? PXIssuer {
                cell.fillCell(issuer: issuerObj)
                cell.addSeparatorLineToBottom(width: width, height: height)
                cell.selectionStyle = .none
                return cell
            }
        }

        if object.objectType == ObjectTypes.entityType {
            if let cell = bundle.loadNibNamed("EntityTypeTableViewCell", owner: nil, options: nil)?[0] as? EntityTypeTableViewCell, let entityObj = object as? EntityType {
                cell.fillCell(entityType: entityObj)
                cell.addSeparatorLineToBottom(width: width, height: height)
                cell.selectionStyle = .none
                return cell
            }
        }

        if object.objectType == ObjectTypes.financialInstitution {
            if let cell = bundle.loadNibNamed("FinancialInstitutionTableViewCell", owner: nil, options: nil)?[0] as? FinancialInstitutionTableViewCell, let financialObj = object as? PXFinancialInstitution {
                cell.fillCell(financialInstitution: financialObj)
                cell.addSeparatorLineToBottom(width: width, height: height)
                cell.selectionStyle = .none
                return cell
            }
        }

        if object.objectType == ObjectTypes.paymentMethod {
            if let cell = bundle.loadNibNamed("CardTypeTableViewCell", owner: nil, options: nil)?[0] as? CardTypeTableViewCell, let pmObject = object as? PXPaymentMethod {
                cell.setPaymentMethod(paymentMethod: pmObject)
                cell.addSeparatorLineToBottom(width: width, height: height)
                cell.selectionStyle = .none
                return cell
            }
        }

        return UITableViewCell()
    }
}

internal enum ObjectTypes: String {
    case payerCost = "payer_cost"
    case issuer = "issuer"
    case entityType = "entity_type"
    case financialInstitution = "financial_instituions"
    case paymentMethod = "payment_method"
}
