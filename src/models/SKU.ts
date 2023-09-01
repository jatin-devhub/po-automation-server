import {
    Model, Table, Column, AllowNull, AutoIncrement, PrimaryKey, DataType, ForeignKey, BelongsTo
} from 'sequelize-typescript';
import { Vendor } from './Vendor';

@Table
class SKU extends Model {
    @AllowNull(false)
    @AutoIncrement
    @PrimaryKey
    @Column({
        type: DataType.INTEGER
    })
    id!: number;

    @Column({ allowNull: false, unique: true, type: DataType.STRING })
    skuCode!: string;

    @Column({ type: DataType.STRING })
    category!: string;

    @Column({ type: DataType.STRING })
    brand!: string;

    @Column({ type: DataType.STRING })
    productTitle!: string;

    @Column({ type: DataType.STRING })
    hsn!: string;

    @Column({ type: DataType.STRING })
    ean!: string;

    @Column({ type: DataType.STRING })
    modelNumber!: string;

    @Column({ type: DataType.STRING })
    size!: string;

    @Column({ type: DataType.STRING })
    colorFamilyColor!: string;

    @Column({ field: 'product_length_cm', type: DataType.FLOAT })
    productLengthCm!: number;

    @Column({ field: 'product_breadth_cm', type: DataType.FLOAT })
    productBreadthCm!: number;

    @Column({ field: 'product_height_cm', type: DataType.FLOAT })
    productHeightCm!: number;

    @Column({ field: 'product_weight_kg', type: DataType.FLOAT })
    productWeightKg!: number;

    @Column({ field: 'master_carton_qty', type: DataType.INTEGER })
    masterCartonQty!: number;

    @Column({ field: 'master_carton_length_cm', type: DataType.FLOAT })
    masterCartonLengthCm!: number;

    @Column({ field: 'master_carton_breadth_cm', type: DataType.FLOAT })
    masterCartonBreadthCm!: number;

    @Column({ field: 'master_carton_height_cm', type: DataType.FLOAT })
    masterCartonHeightCm!: number;

    @Column({ field: 'master_carton_weight_kg', type: DataType.FLOAT })
    masterCartonWeightKg!: number;

    @Column({ type: DataType.FLOAT })
    MRP!: number;

    @ForeignKey(() => Vendor)
    @Column({ type: DataType.INTEGER })
    vendorId!: number;

    @BelongsTo(() => Vendor)
    vendor?: Vendor;
}

export default SKU;
