module ApplicationHelper
  include Pagy::Frontend

  def nav_link(label, path)
    active = current_page?(path) || request.path.start_with?(path == root_path ? "\0" : path)
    css = "text-sm font-medium px-1 py-0.5 transition-colors " +
          (active ? "text-accent border-b border-accent" : "text-muted hover:text-paper")
    link_to label, path, class: css
  end
end
