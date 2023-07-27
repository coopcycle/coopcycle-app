//
//  IssuerRowTableViewCell.swift
//  MercadoPagoSDK
//
//  Created by Eden Torres on 10/17/16.
//  Copyright © 2016 MercadoPago. All rights reserved.
//

import UIKit

class IssuerRowTableViewCell: UITableViewCell {

    @IBOutlet weak var issuerImage: UIImageView!

    func fillCell(issuer: PXIssuer) {
        if let image = ResourceManager.shared.getImage("issuer_\(issuer.id)") {
            issuerImage.image = image
        } else {
            issuerImage.image = nil
            textLabel?.text = issuer.name
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
