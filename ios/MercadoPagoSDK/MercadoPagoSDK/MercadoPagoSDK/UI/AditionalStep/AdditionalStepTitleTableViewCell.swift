//
//  AdditionalStepTitleTableViewCell.swift
//  MercadoPagoSDK
//
//  Created by Eden Torres on 10/13/16.
//  Copyright © 2016 MercadoPago. All rights reserved.
//

import UIKit

class AdditionalStepTitleTableViewCell: UITableViewCell, TitleCellScrollable {

    @IBOutlet weak var cell: UIView!
    @IBOutlet weak var title: PXNavigationHeaderLabel!

    override func awakeFromNib() {
        super.awakeFromNib()
        self.selectionStyle = UITableViewCell.SelectionStyle.none
        // Initialization code
    }

    internal func updateTitleFontSize(toSize: CGFloat) {
        self.title.font = Utils.getFont(size: toSize)
    }

    func setTitle(string: String!) {
        title.text = string
        title.font = Utils.getFont(size: title.font.pointSize)
        cell.backgroundColor = ThemeManager.shared.getMainColor()
    }
}
