import { BaseComponentRender, BaseComponentSheet, Component, ComponentChildren } from '@univerjs/base-component';
import styles from './index.module.less';

export interface BaseTextButtonProps {
    active?: boolean;
    label?: ComponentChildren;
    onClick?: (...arg: any) => void;
}

interface IState {
    active?: boolean;
}

export class TextButton extends Component<BaseTextButtonProps, IState> {
    Render: BaseComponentRender;

    initialize() {
        const component = this._context.getPluginManager().getPluginByName<BaseComponentSheet>('ComponentSheet')!;
        this.Render = component.getComponentRender();
        this.state = {
            active: this.props.active,
        };
    }

    handleClick = () => {
        const active = !this.state.active;
        this.props.onClick?.(active);

        this.setState({
            active,
        });
    };

    render() {
        const { label } = this.props;
        const { active } = this.state;
        const Button = this.Render.renderFunction('Button');

        return (
            <div className={styles.textButton}>
                <Button type="text" active={active} onClick={this.handleClick}>
                    {label}
                </Button>
            </div>
        );
    }
}
