import * as path from 'path';
import * as fs from 'fs';
import { window, workspace, commands } from 'vscode';
import axios from 'axios';

// 获取数据
class GetApiData {

    /**
     * 当前用户配置
     * 
     * @private
     * @type {*}
     */
    private config: any = workspace.getConfiguration('api');

    /**
     * 更新配置文件
     */
    private install() {
        let oldconfig = this.config;
        let newconfig = workspace.getConfiguration('api');
        this.config = newconfig;
        window.showInformationMessage('API has been changed! Please restart.', { title: "Restart vscode" })
            .then(function (item) {
                if (!item) return;
                commands.executeCommand('workbench.action.reloadWindow');
            });

    }
    /**
     * 初始化
     * 
     * @private
     */
    private initialize(): void {

        let firstload = this.checkFirstload();  // 是否初次加载插件

        this.getApiData();

    }

    /**
     * 获取imageurl
     */
    private getApiData() {
        if (this.config.url == "") {
            window.showInformationMessage('请打开setting.json设置你的api接口.');
            return;
        }
        
        axios.get(this.config.url)
        .then((response) => {
            if (response.data.code == 200) {
                this.replaceEditorSelection(response.data.data);
            } else {
                window.showInformationMessage("发生意外错误，请查看接口访问状态.");
                return;
            }
        }).catch((error) => { 
            window.showInformationMessage(error);
            return;
        });
    }

    /**
     * 写入编辑器
     * @param text string
     */
    private replaceEditorSelection(text: string) {
        const editor = window.activeTextEditor;
        if (editor) {

            const selections = editor.selections;
          
            editor.edit((editBuilder) => {
              selections.forEach((selection) => {
                editBuilder.replace(selection, '');
                editBuilder.insert(selection.active, text);
              });
            });
        }
      }
      
    /**
     * 检测是否初次加载，并在初次加载的时候提示用户
     */
    private checkFirstload(): boolean {
        const configPath = path.join(__dirname, '../assets/config.json');
        let info: { firstload: boolean } = JSON.parse(fs.readFileSync(configPath, 'utf-8'));

        if (info.firstload) {
            // 提示
            window.showInformationMessage('Welcome to use Insert Api Data! U can config it in settings.json.')
            // 标识插件已启动过
            info.firstload = false;
            fs.writeFileSync(configPath, JSON.stringify(info, null, '    '), 'utf-8');

            return true;
        }

        return false;
    }


    /**
     * 初始化，并开始监听配置文件改变
     * 
     * @returns {vscode.Disposable} 
     */
    public watch() {
        this.initialize();
        return workspace.onDidChangeConfiguration(() => this.install());
    }

}

export default new GetApiData();
