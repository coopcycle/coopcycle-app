//
//  File.swift
//  MercadoPagoSDK
//
//  Created by Demian Tejo on 9/11/17.
//  Copyright © 2017 MercadoPago. All rights reserved.
//

internal extension UIView {

    //Eventualmente hay que borrar esto. Cuando summary deje de usarlo
    func addSeparatorLineToTop(horizontalMargin: CGFloat, width: CGFloat, height: CGFloat) {
        let lineFrame = CGRect(origin: CGPoint(x: horizontalMargin, y: 0), size: CGSize(width: width, height: height))
        let line = UIView(frame: lineFrame)
        line.alpha = 0.6
        line.backgroundColor = UIColor.UIColorFromRGB(0xEEEEEE)
        addSubview(line)
    }

    @objc func addSeparatorLineToTop(height: CGFloat, horizontalMarginPercentage: CGFloat = 100, color: UIColor = .UIColorFromRGB(0xEEEEEE)) {
        let line = UIView()
        line.translatesAutoresizingMaskIntoConstraints = false
        line.backgroundColor = color
        self.addSubview(line)
        PXLayout.pinTop(view: line).isActive = true
        PXLayout.matchWidth(ofView: line, withPercentage: horizontalMarginPercentage).isActive = true
        PXLayout.centerHorizontally(view: line).isActive = true
        PXLayout.setHeight(owner: line, height: height).isActive = true
    }

    //Eventualmente hay que borrar esto. Cuando summary deje de usarlo
    func addSeparatorLineToBottom(horizontalMargin: CGFloat, width: CGFloat, height: CGFloat) {
        let lineFrame = CGRect(origin: CGPoint(x: horizontalMargin, y: self.frame.size.height - height), size: CGSize(width: width, height: height))
        let line = UIView(frame: lineFrame)
        line.alpha = 0.6
        line.backgroundColor = .UIColorFromRGB(0xEEEEEE)
        addSubview(line)
    }

    @objc func addSeparatorLineToBottom(height: CGFloat, horizontalMarginPercentage: CGFloat = 100, color: UIColor = .UIColorFromRGB(0xEEEEEE)) {
        let line = UIView()
        line.translatesAutoresizingMaskIntoConstraints = false
        line.backgroundColor = color
        self.addSubview(line)
        PXLayout.pinBottom(view: line).isActive = true
        PXLayout.matchWidth(ofView: line, withPercentage: horizontalMarginPercentage).isActive = true
        PXLayout.centerHorizontally(view: line).isActive = true
        PXLayout.setHeight(owner: line, height: height).isActive = true
    }

    //Eventualmente hay que borrar esto. Cuando summary deje de usarlo
    func addLine(posY: CGFloat, horizontalMargin: CGFloat, width: CGFloat, height: CGFloat) {
        let lineFrame = CGRect(origin: CGPoint(x: horizontalMargin, y: posY), size: CGSize(width: width, height: height))
        let line = UIView(frame: lineFrame)
        line.alpha = 0.6
        line.backgroundColor = UIColor(red: 0.00, green: 0.00, blue: 0.00, alpha: 0.4)
        addSubview(line)
    }

    @objc func addLine(yCoordinate: CGFloat, height: CGFloat, horizontalMarginPercentage: CGFloat = 100, color: UIColor = .UIColorFromRGB(0xEEEEEE)) {
        let line = UIView()
        line.translatesAutoresizingMaskIntoConstraints = false
        line.backgroundColor = color
        self.addSubview(line)
        PXLayout.pinBottom(view: line, withMargin: yCoordinate).isActive = true
        PXLayout.matchWidth(ofView: line, withPercentage: horizontalMarginPercentage).isActive = true
        PXLayout.centerHorizontally(view: line).isActive = true
        PXLayout.setHeight(owner: line, height: height).isActive = true
    }

    @objc func removeAllSubviews(except views: [UIView] = []) {
        for subview in self.subviews {
            if !views.contains(subview) {
                subview.removeFromSuperview()
            }
        }
    }

    func addSubviewAtFullSize(with view: UIView) {
        self.addSubview(view)
        PXLayout.centerHorizontally(view: view).isActive = true
        PXLayout.centerVertically(view: view).isActive = true
        PXLayout.matchWidth(ofView: view).isActive = true
        PXLayout.matchHeight(ofView: view).isActive = true
    }

    func dropShadow(scale: Bool = true, radius: CGFloat = 1, opacity: Float = 0.25, offset: CGSize = .zero, color: UIColor = .black) {
        layer.masksToBounds = false
        layer.shadowColor = color.cgColor
        layer.shadowOpacity = opacity
        layer.shadowOffset = offset
        layer.shadowRadius = radius
        layer.shouldRasterize = true
        layer.rasterizationScale = scale ? UIScreen.main.scale : 1
    }

    func fadeTransition(_ duration: CFTimeInterval) {
        let animation = CATransition()
        animation.timingFunction = CAMediaTimingFunction(name:
            CAMediaTimingFunctionName.easeInEaseOut)
        animation.type = CATransitionType.fade
        animation.duration = duration
        layer.add(animation, forKey: CATransitionType.fade.rawValue)
    }
}
