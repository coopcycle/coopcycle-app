//
//  FinancialInstitutionTableViewCell.swift
//  MercadoPagoSDK
//
//  Created by AUGUSTO COLLERONE ALFONSO on 3/9/17.
//  Copyright © 2017 MercadoPago. All rights reserved.
//

import UIKit

class FinancialInstitutionTableViewCell: UITableViewCell {

    @IBOutlet weak var financialInstitutionImage: UIImageView!

    func fillCell(financialInstitution: PXFinancialInstitution) {
        if let image = ResourceManager.shared.getImage("financial_institution_\(financialInstitution.id)") {
            financialInstitutionImage.image = image
        } else {
            financialInstitutionImage.image = nil
            textLabel?.text = financialInstitution.id
            textLabel?.textAlignment = .center
        }
    }

    func addSeparatorLineToBottom(width: Double, height: Double) {
        let lineFrame = CGRect(origin: CGPoint(x: 0, y: Int(height)), size: CGSize(width: width, height: 0.5))
        let line = UIView(frame: lineFrame)
        line.alpha = 0.6
        line.backgroundColor = UIColor.px_grayLight()
        addSubview(line)
    }
}
