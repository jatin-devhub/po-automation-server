import { Model, Table, Column, DataType, ForeignKey, BelongsTo, HasMany, AllowNull, AutoIncrement, PrimaryKey } from 'sequelize-typescript';
import BuyingOrder from './BuyingOrder';
import SKU from './SKU';
import Vendor from './Vendor';

@Table({
  tableName: 'comments',
})
export default class Comment extends Model {
  @AllowNull(false)
  @AutoIncrement
  @PrimaryKey
  @Column({
    type: DataType.INTEGER,
  })
  id!: number;

  @AllowNull(false)
  @Column({
    type: DataType.STRING,
  })
  comment!: string;

  @ForeignKey(() => Comment)
  @Column({
    type: DataType.INTEGER
  })
  commentId!: number

  @ForeignKey(() => BuyingOrder)
  @Column({
    type: DataType.INTEGER
  })
  buyingOrderId!: number

  @ForeignKey(() => SKU)
  @Column({
    type: DataType.INTEGER
  })
  skuId!: number

  @ForeignKey(() => Vendor)
  @Column({
    type: DataType.INTEGER
  })
  vendorId!: number

  @HasMany(() => Comment)
  comments!: Comment[]

  @BelongsTo(() => Comment)
  parentComment!: Comment;

  @BelongsTo(() => BuyingOrder)
  buyingOrder!: BuyingOrder;

  @BelongsTo(() => SKU)
  sku!: SKU;

  @BelongsTo(() => Vendor)
  vendor!: Vendor;
  
}
