//
//  BankInsterestTableViewCell.swift
//  MercadoPagoSDK
//
//  Created by AUGUSTO COLLERONE ALFONSO on 4/3/17.
//  Copyright © 2017 MercadoPago. All rights reserved.
//

import UIKit

class BankInsterestTableViewCell: UITableViewCell {

    @IBOutlet weak var mainLabel: UILabel!

    static let cellHeight: CGFloat = 35

    override func awakeFromNib() {
        super.awakeFromNib()
        // Initialization code
        mainLabel.text = "No incluye intereses bancarios".localized
        mainLabel.textAlignment = .center
        mainLabel.font = Utils.getLightFont(size: 14)
        mainLabel.textColor = ThemeManager.shared.navigationBar().tintColor
        self.selectionStyle = .none
    }

    override func setSelected(_ selected: Bool, animated: Bool) {
        super.setSelected(selected, animated: animated)

        // Configure the view for the selected state
    }

}
