//
//  PXPointsAndDiscounts.swift
//  MercadoPagoSDK
//
//  Created by Esteban Adrian Boffa on 22/08/2019.
//

import Foundation

struct PXPointsAndDiscounts: Decodable {

    let points: PXPoints?
    let discounts: PXDiscounts?
    let crossSelling: [PXCrossSellingItem]?

    init(points: PXPoints?, discounts: PXDiscounts?, crossSelling: [PXCrossSellingItem]?) {
        self.points = points
        self.discounts = discounts
        self.crossSelling = crossSelling
    }

    enum PointsAndDiscountsCodingKeys: String, CodingKey {
        case points = "mpuntos"
        case discounts
        case crossSelling = "cross_selling"
    }

    init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: PointsAndDiscountsCodingKeys.self)
        let points: PXPoints? = try container.decodeIfPresent(PXPoints.self, forKey: .points)
        let discounts: PXDiscounts? = try container.decodeIfPresent(PXDiscounts.self, forKey: .discounts)
        let crossSelling: [PXCrossSellingItem]? = try container.decodeIfPresent([PXCrossSellingItem].self, forKey: .crossSelling)
        self.init(points: points, discounts: discounts, crossSelling: crossSelling)
    }

    static func fromJSON(data: Data) throws -> PXPointsAndDiscounts {
        return try JSONDecoder().decode(PXPointsAndDiscounts.self, from: data)
    }
}
