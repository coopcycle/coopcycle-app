//
//  InputComponent.swift
//  MercadoPagoSDK
//
//  Created by Demian Tejo on 9/27/17.
//  Copyright © 2017 MercadoPago. All rights reserved.
//

import UIKit
protocol InputComponentListener: NSObjectProtocol {
    func textChangedIn(component: SimpleInputComponent)
    func dropDownOptionChanged(text: String)
}

class SimpleInputComponent: UIView, PXComponent {
    let INACTIVE_BORDER_COLOR = UIColor.UIColorFromRGB(0xCCCCCC)
    let ACTIVE_BORDER_COLOR = ThemeManager.shared.secondaryColor()
    let HEIGHT: CGFloat = 83.0
    let INPUT_HEIGHT: CGFloat = 45.0
    let HORIZONTAL_MARGIN: CGFloat = 31.0
    var placeholder: String?
    var numeric: Bool = false
    weak var textFieldDelegate: UITextFieldDelegate!
    var inputTextField: HoshiTextField!
    weak var delegate: InputComponentListener?
    init(frame: CGRect, numeric: Bool = false, placeholder: String? = nil, textFieldDelegate: UITextFieldDelegate) {
        super.init(frame: frame)
        self.numeric = numeric
        self.placeholder = placeholder
        self.textFieldDelegate = textFieldDelegate
        self.backgroundColor = .white
        self.setupView()
    }
    required init?(coder aDecoder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
    func getHeight() -> CGFloat {
        return HEIGHT
    }
    func getWeight() -> CGFloat {
        return self.frame.size.width
    }
    func setupView() {
        inputTextField = HoshiTextField(frame: CGRect(x: getInputX(), y: getInputY(), width: getInputWidth(), height: INPUT_HEIGHT))
        if let placeholder = placeholder {
            inputTextField.placeholder = placeholder
        }
        inputTextField.font = Utils.getFont(size: 20.0)
        inputTextField.borderInactiveColor = INACTIVE_BORDER_COLOR
        inputTextField.borderActiveColor = ACTIVE_BORDER_COLOR
        inputTextField.autocorrectionType = .no
        inputTextField.addTarget(self, action: #selector(SimpleInputComponent.editingChanged(textField:)), for: UIControl.Event.editingChanged)
        self.addSubview(inputTextField)
        self.frame.size.height = getHeight()
        inputTextField.text = ""
    }
    func getInputX() -> CGFloat {
        return HORIZONTAL_MARGIN
    }
    func getInputY() -> CGFloat {
        return (self.getHeight() - INPUT_HEIGHT) / 2
    }
    func getInputWidth() -> CGFloat {
        return self.getWeight() - HORIZONTAL_MARGIN * 2
    }
    func componentBecameFirstResponder() {
        self.inputTextField.becomeFirstResponder()
    }
    func componentResignFirstResponder() {
        self.inputTextField.resignFirstResponder()
    }

    open func setInputAccessoryView(inputAccessoryView: UIView) {
        self.inputTextField.inputAccessoryView = inputAccessoryView
    }
    @objc open func editingChanged(textField: UITextField) {
        if let delegate = self.delegate {
            delegate.textChangedIn(component: self)
        }
    }
    open func setText(text: String) {
        self.inputTextField.text = text
    }
    open func getInputText() -> String {
        guard let text = self.inputTextField.text else {
            return ""
        }
        return text
    }
}

class CompositeInputComponent: SimpleInputComponent, UIPickerViewDataSource, UIPickerViewDelegate {
    let COMBO_WEIGHT: CGFloat = 68.0
    let MARGIN_BETWEEN_ELEMENTS: CGFloat = 14.0
    let PICKER_HEIGHT: CGFloat = 216.0
    var dropDownSelectedOptionText: String!
    var dropDownOptions: [String]!
    var dropDownPlaceholder: String?
    var dropDownTextField: HoshiTextField!
    var optionSelected: Int!
    init(frame: CGRect, numeric: Bool = true, placeholder: String? = nil, dropDownPlaceholder: String? = nil, dropDownOptions: [String], textFieldDelegate: UITextFieldDelegate) {
        self.dropDownSelectedOptionText = dropDownOptions[0]
        self.optionSelected = 0
        self.dropDownPlaceholder = dropDownPlaceholder
        self.dropDownOptions = dropDownOptions
        super.init(frame: frame, numeric: numeric, placeholder: placeholder, textFieldDelegate: textFieldDelegate)
    }
    required init?(coder aDecoder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
    override func setupView() {
        dropDownTextField = HoshiTextField(frame: CGRect(x: HORIZONTAL_MARGIN, y: getInputY(), width: COMBO_WEIGHT, height: INPUT_HEIGHT))
        if let dropDownPlaceholder = dropDownPlaceholder {
            dropDownTextField.placeholder = dropDownPlaceholder
        }
        dropDownTextField.inputView = getPicker()
        dropDownTextField.inputAccessoryView = getToolBar()
        if dropDownOptions.count < 2 {
            dropDownTextField.isEnabled = false
        }
        dropDownTextField.text = dropDownOptions[0]
        dropDownTextField.borderInactiveColor = INACTIVE_BORDER_COLOR
        dropDownTextField.borderActiveColor = ACTIVE_BORDER_COLOR
        dropDownTextField.font = Utils.getFont(size: 20.0)
        inputTextField = HoshiTextField(frame: CGRect(x: getInputX(), y: getInputY(), width: getInputWidth(), height: INPUT_HEIGHT))
        inputTextField.addTarget(self, action: #selector(SimpleInputComponent.editingChanged(textField:)), for: UIControl.Event.editingChanged)
        inputTextField.borderInactiveColor = INACTIVE_BORDER_COLOR
        inputTextField.borderActiveColor = ACTIVE_BORDER_COLOR
        inputTextField.autocorrectionType = .no
        inputTextField.font = Utils.getFont(size: 20.0)
        inputTextField.text = ""
        if numeric {
            inputTextField.keyboardType = UIKeyboardType.numberPad
        }
        if let placeholder = placeholder {
            inputTextField.placeholder = placeholder
        }
        self.addSubview(dropDownTextField)
        self.addSubview(inputTextField)
        self.frame.size.height = getHeight()
    }
    override func getInputX() -> CGFloat {
        return HORIZONTAL_MARGIN + COMBO_WEIGHT + MARGIN_BETWEEN_ELEMENTS
    }
    override func getInputWidth() -> CGFloat {
         return self.getWeight() - HORIZONTAL_MARGIN * 2 - COMBO_WEIGHT - MARGIN_BETWEEN_ELEMENTS
    }
    func getPicker() -> UIPickerView {
        let pickerView = UIPickerView(frame: CGRect(x: 0, y: 150, width: self.frame.width, height: PICKER_HEIGHT))
        pickerView.backgroundColor = UIColor.white
        pickerView.showsSelectionIndicator = true
        pickerView.dataSource = self
        pickerView.delegate = self
        return pickerView
    }
    func getToolBar() -> PXToolbar {
        let toolBar = PXToolbar()
        toolBar.barStyle = UIBarStyle.default
        let doneButton = UIBarButtonItem(title: "OK".localized, style: .plain, target: self, action: #selector(CompositeInputComponent.donePicker))
        let spaceButton = UIBarButtonItem(barButtonSystemItem: UIBarButtonItem.SystemItem.flexibleSpace, target: nil, action: nil)
        let font = Utils.getFont(size: 14)
        doneButton.setTitleTextAttributes([NSAttributedString.Key.font: font], for: UIControl.State())
        toolBar.setItems([spaceButton, doneButton], animated: false)
        toolBar.isUserInteractionEnabled = true
        return toolBar
    }

    //Picker View
    open func numberOfComponents(in pickerView: UIPickerView) -> Int {
        return 1
    }

    func pickerView(_ pickerView: UIPickerView, numberOfRowsInComponent component: Int) -> Int {
        return self.dropDownOptions.count
    }

    open func pickerView(_ pickerView: UIPickerView, titleForRow row: Int, forComponent component: Int) -> String? {
        return self.dropDownOptions[row]
    }

    open func pickerView(_ pickerView: UIPickerView, didSelectRow row: Int, inComponent component: Int) {
        dropDownSelectedOptionText = self.dropDownOptions[row]
        self.optionSelected = row
        dropDownTextField.text = dropDownSelectedOptionText
        self.inputTextField.text = ""
        self.delegate?.dropDownOptionChanged(text: dropDownSelectedOptionText)
    }
    @objc open func donePicker() {
        dropDownTextField.resignFirstResponder()
        inputTextField.becomeFirstResponder()
    }

}
