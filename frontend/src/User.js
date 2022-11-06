class User{
    constructor(id, display_name, github_url){
        this.id = id;
        this.display_name = display_name;
        this.github_url = github_url;
    }

    setUserData(){
        localStorage.setItem('id', this.id);
        localStorage.setItem('display_name', this.display_name);
        localStorage.setItem('github_url', this.github_url);
    }

    static getUserData(){
        
    }
}