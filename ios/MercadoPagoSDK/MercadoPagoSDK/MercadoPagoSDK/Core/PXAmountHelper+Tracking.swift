//
//  PXAmountHelper+Tracking.swift
//  MercadoPagoSDK
//
//  Created by Eden Torres on 25/10/2018.
//
import Foundation

extension PXAmountHelper {
    func getDiscountForTracking() -> [String: Any] {
        var dic: [String: Any] = [:]

        guard let discount = discount, let campaign = campaign else {
            return dic
        }

        dic["percent_off"] = discount.percentOff
        dic["amount_off"] = discount.amountOff
        dic["coupon_amount"] = discount.couponAmount
        dic["max_coupon_amount"] = campaign.maxCouponAmount
        dic["max_redeem_per_user"] = campaign.maxRedeemPerUser
        dic["campaign_id"] = campaign.id
        return dic
    }
}
